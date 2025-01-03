import markdown
import os
from datetime import datetime
import re
from pathlib import Path

def get_title_from_md(md_content):
    """从 Markdown 内容中提取标题"""
    lines = md_content.split('\n')
    for line in lines:
        if line.startswith('# '):
            return line[2:].strip()
    return "无标题"

def create_html_template(title, html_content, relative_path):
    """创建标准的 HTML 模板"""
    template = f'''<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - 心智探奇</title>
    <link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.3.1/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{relative_path}css/style.css">
    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/bootstrap-icons/1.7.2/font/bootstrap-icons.css">
</head>
<body>
    <div id="header-placeholder"></div>

    <main class="container my-5">
        <!-- 顶部返回按钮 -->
        <div class="row mb-4">
            <div class="col-md-8 mx-auto">
                <button onclick="goBack()" class="btn text-primary border-0">
                    <i class="bi bi-arrow-left"></i> 返回文章列表
                </button>
            </div>
        </div>

        <div class="row justify-content-center">
            <div class="col-md-8">
                <article class="article-content">
                    <header class="mb-4">
                        <h1>{title}</h1>
                    </header>

                    <div class="article-body">
                        {html_content}
                    </div>
                </article>
            </div>
        </div>

        <!-- 底部返回按钮 -->
        <div class="row mt-4">
            <div class="col-md-8 mx-auto">
                <button onclick="goBack()" class="btn text-primary border-0">
                    <i class="bi bi-arrow-left"></i> 返回文章列表
                </button>
            </div>
        </div>
    </main>

    <div id="footer-placeholder"></div>

    <script src="https://cdn.bootcdn.net/ajax/libs/popper.js/2.11.6/umd/popper.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.3.1/js/bootstrap.min.js"></script>
    <script src="{relative_path}js/main.js"></script>
</body>
</html>'''
    return template

def convert_md_to_html(md_file_path, output_dir):
    """将 Markdown 文件转换为 HTML 文件"""
    # 读取 Markdown 文件
    with open(md_file_path, 'r', encoding='utf-8') as f:
        md_content = f.read()

    # 获取标题
    title = get_title_from_md(md_content)

    # 转换 Markdown 为 HTML
    html_content = markdown.markdown(
        md_content,
        extensions=['extra', 'codehilite', 'tables', 'toc']
    )

    # 计算相对路径
    md_path = Path(md_file_path).resolve()  # 转换为绝对路径
    output_path = Path(output_dir).resolve()  # 转换为绝对路径
    
    # 计算从输出目录到项目根目录的层级数
    project_root = Path(os.path.dirname(os.path.dirname(os.path.dirname(output_path))))  # 项目根目录
    relative_path = '../' * len(output_path.relative_to(project_root).parts)

    # 创建完整的 HTML
    html_output = create_html_template(title, html_content, relative_path)

    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)

    # 生成输出文件名
    output_file = os.path.join(output_dir, os.path.splitext(os.path.basename(md_file_path))[0] + '.html')

    # 写入 HTML 文件
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_output)

    print(f"已生成 HTML 文件: {output_file}")

def main():
    """主函数"""
    # 获取当前脚本所在目录的绝对路径
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 获取项目根目录（假设脚本在 test/tools 目录下）
    project_root = os.path.dirname(os.path.dirname(script_dir))
    
    # 获取当前日期
    today = datetime.now()
    year = today.strftime('%Y')
    month = today.strftime('%m')

    # 设置输入和输出路径（使用绝对路径）
    md_dir = os.path.join(project_root, "content", "articles")  # Markdown 文件目录
    output_base = os.path.join(project_root, "test", "articles", year, month)  # 输出目录

    # 确保输入目录存在
    if not os.path.exists(md_dir):
        os.makedirs(md_dir)
        print(f"创建目录: {md_dir}")

    # 遍历所有 Markdown 文件
    for md_file in os.listdir(md_dir):
        if md_file.endswith('.md'):
            md_path = os.path.join(md_dir, md_file)
            convert_md_to_html(md_path, output_base)

if __name__ == "__main__":
    main() 