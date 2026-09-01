import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";

type Props = { content: string; onChange: (html: string) => void; onNotice: (message: string) => void };

export function RichTextEditor({ content, onChange, onNotice }: Props) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: true } }), Image.configure({ allowBase64: true })],
    content,
    immediatelyRender: false,
    editorProps: { attributes: { class: "tiptap-content" } },
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) editor.commands.setContent(content);
  }, [content, editor]);

  if (!editor) return <div className="tiptap-loading">正在载入编辑器…</div>;

  const setLink = () => {
    const current = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("输入链接地址", current || "https://");
    if (href === null) return;
    if (!href.trim()) editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };
  const addImage = (file?: File) => {
    if (!file) return;
    if (file.size > 1_500_000) { onNotice("插图请控制在 1.5MB 以内"); return; }
    const reader = new FileReader();
    reader.onload = () => editor.chain().focus().setImage({ src: String(reader.result), alt: file.name }).run();
    reader.readAsDataURL(file);
  };

  return <div className="tiptap-editor">
    <div className="tiptap-toolbar" role="toolbar" aria-label="富文本编辑工具栏">
      <button type="button" className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button type="button" className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
      <button type="button" className={editor.isActive("paragraph") ? "is-active" : ""} onClick={() => editor.chain().focus().setParagraph().run()}>正文</button><i />
      <button type="button" className={editor.isActive("blockquote") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleBlockquote().run()}>描述文本</button><i />
      <button type="button" className={editor.isActive("bold") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></button>
      <button type="button" className={editor.isActive("italic") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
      <button type="button" className={editor.isActive("underline") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button>
      <button type="button" className={editor.isActive("bulletList") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleBulletList().run()}>• 列表</button>
      <button type="button" className={editor.isActive("orderedList") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. 列表</button><i />
      <button type="button" className={editor.isActive("link") ? "is-active" : ""} onClick={setLink}>链接</button>
      <button type="button" onClick={() => imageInputRef.current?.click()}>插入图片</button><i />
      <button type="button" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} aria-label="撤销">↶</button>
      <button type="button" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} aria-label="重做">↷</button>
      <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={(event) => { addImage(event.target.files?.[0]); event.target.value = ""; }} />
    </div>
    <EditorContent editor={editor} />
  </div>;
}
