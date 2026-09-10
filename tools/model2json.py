#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把常见 3D 模型转成站点可读的 JSON 点云。

用法:
    python3 tools/model2json.py model.obj -o assets/models/xxx.json
    python3 tools/model2json.py model.ply -o out.json -n 20000   # 最多采样 2 万点

支持: .obj .ply .xyz .txt .csv（纯坐标，每行 3 个数）
输出: {"points": [[x,y,z], ...], "count": N}
"""

import argparse, json, os, random, re, sys

random.seed(0)


def read_obj(path):
    """只取 v 顶点行；若有 f 面行则额外在三角形内随机撒点，让点云更密。"""
    verts, tris = [], []
    with open(path, encoding="utf-8", errors="ignore") as f:
        for line in f:
            if line.startswith("v "):
                p = line[2:].split()
                if len(p) >= 3:
                    try:
                        verts.append([float(p[0]), float(p[1]), float(p[2])])
                    except ValueError:
                        pass
            elif line.startswith("f "):
                idx = [int(t.split("/")[0]) for t in line[2:].split() if t.split("/")[0].isdigit()]
                for i in range(1, len(idx) - 1):
                    tris.append((idx[0], idx[i], idx[i + 1]))
    if not tris:
        return verts
    return sample_tris(verts, tris)


def sample_tris(verts, tris, per_tri=8):
    """在三角面内均匀撒点（重心坐标采样）。"""
    out = []
    n = len(verts)
    for a, b, c in tris:
        va, vb, vc = verts[a - 1], verts[b - 1], verts[c - 1]
        for _ in range(per_tri):
            u, v = random.random(), random.random()
            if u + v > 1:
                u, v = 1 - u, 1 - v
            w = 1 - u - v
            out.append([va[0] * w + vb[0] * u + vc[0] * v,
                        va[1] * w + vb[1] * u + vc[1] * v,
                        va[2] * w + vb[2] * u + vc[2] * v])
    return out


def read_ply(path):
    """读 ascii / binary_little_endian 的 vertex 元素。"""
    with open(path, "rb") as f:
        raw = f.read()
    head_end = raw.find(b"end_header")
    if head_end < 0:
        raise SystemExit("不是合法的 PLY 文件")
    header = raw[:head_end].decode("ascii", "ignore").splitlines()
    fmt = "ascii"
    vcount = 0
    props = []
    in_vertex = False
    for line in header:
        if line.startswith("format "):
            fmt = line.split()[1]
        elif line.startswith("element vertex"):
            vcount = int(line.split()[2])
            in_vertex = True
        elif line.startswith("element ") and not line.startswith("element vertex"):
            in_vertex = False
        elif in_vertex and line.startswith("property "):
            parts = line.split()
            if len(parts) >= 3:
                props.append(parts[2])  # 属性名

    data = raw[head_end + len(b"end_header") + 1:]
    pts = []

    if fmt.startswith("ascii"):
        lines = data.decode("ascii", "ignore").splitlines()[:vcount]
        for ln in lines:
            p = ln.split()
            try:
                pts.append([float(p[0]), float(p[1]), float(p[2])])
            except (ValueError, IndexError):
                continue
    else:
        import struct
        types = {"char": 1, "uchar": 1, "int8": 1, "uint8": 1,
                 "short": 2, "ushort": 2, "int16": 2, "uint16": 2,
                 "int": 4, "uint": 4, "int32": 4, "uint32": 4, "float32": 4, "float": 4,
                 "double": 8, "float64": 8}
        # 重新解析每个 property 的类型
        sizes, names = [], []
        for line in header:
            if line.startswith("property "):
                parts = line.split()
                sizes.append(types.get(parts[1], 4))
                names.append(parts[2] if len(parts) > 2 else "")
        stride = sum(sizes)
        codes = {1: "b", 2: "h", 4: "f", 8: "d"}
        for i in range(vcount):
            off = i * stride
            if off + stride > len(data):
                break
            o = 0
            xyz = []
            for k, sz in enumerate(sizes):
                if names[k] in ("x", "y", "z"):
                    xyz.append(struct.unpack_from(codes[sz], data, off + o)[0])
                o += sz
                if len(xyz) == 3:
                    break
            if len(xyz) == 3:
                pts.append(xyz)
    return pts


def read_xyz(path):
    """每行 3 个数（空格/逗号/制表符分隔）。"""
    pts = []
    with open(path, encoding="utf-8", errors="ignore") as f:
        for line in f:
            s = line.strip()
            if not s or s.startswith("#"):
                continue
            p = re.split(r"[,\s]+", s)
            try:
                pts.append([float(p[0]), float(p[1]), float(p[2])])
            except (ValueError, IndexError):
                continue
    return pts


def main():
    ap = argparse.ArgumentParser(description="3D 模型 → JSON 点云")
    ap.add_argument("input", help="输入文件 (.obj/.ply/.xyz/.txt/.csv)")
    ap.add_argument("-o", "--out", required=True, help="输出 JSON 路径")
    ap.add_argument("-n", "--max", type=int, default=0, help="最多保留点数（0=全部）")
    args = ap.parse_args()

    ext = os.path.splitext(args.input)[1].lower()
    if ext == ".obj":
        pts = read_obj(args.input)
    elif ext == ".ply":
        pts = read_ply(args.input)
    elif ext in (".xyz", ".txt", ".csv", ".pts"):
        pts = read_xyz(args.input)
    else:
        raise SystemExit("不支持的格式: %s（请转 OBJ/PLY/XYZ）" % ext)

    if not pts:
        raise SystemExit("没有解析到任何顶点")

    if args.max and len(pts) > args.max:
        pts = random.sample(pts, args.max)

    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump({"count": len(pts), "points": pts}, f)

    print("已写出 %s：%d 个点" % (args.out, len(pts)))


if __name__ == "__main__":
    main()
