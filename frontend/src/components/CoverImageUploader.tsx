import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type Props = { value: string; onChange: (value: string) => void; onNotice: (message: string) => void };

export function CoverImageUploader({ value, onChange, onNotice }: Props) {
  const onDropAccepted = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange(String(reader.result));
      onNotice("封面图片已载入，保存后写入数据库");
    };
    reader.readAsDataURL(file);
  }, [onChange, onNotice]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"], "image/gif": [".gif"] },
    maxFiles: 1,
    maxSize: 1_500_000,
    multiple: false,
    onDropAccepted,
    onDropRejected: () => onNotice("请选择 JPG、PNG、WebP 或 GIF，且图片不超过 1.5MB"),
  });

  return <div {...getRootProps({ className: `cover-dropzone${isDragActive ? " is-dragging" : ""}${isDragReject ? " is-rejected" : ""}` })}>
    <input {...getInputProps()} />
    {value ? <img src={value} alt="当前封面" /> : <div className="cover-dropzone-placeholder" aria-hidden="true">＋</div>}
    <div><strong>{isDragActive ? "松开即可选择图片" : value ? "拖入或点击更换封面" : "拖入或点击上传封面"}</strong><span>JPG、PNG、WebP、GIF · 最大 1.5MB</span></div>
  </div>;
}
