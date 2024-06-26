import React, { useEffect, useState } from "react";
import { Progress } from "antd";
import Style from './style.module.less'

interface IFileShowProps {
  file: File,
  uploadProgress: number
}

export const FileShow: React.FC<IFileShowProps> = ({ file, uploadProgress }) => {
  const [showContent, setShowContent] = useState<string>('')
  

  const getContent = () => {
    if (file.type.includes('image')) {
      const reader = new FileReader()
      reader.onload = e => {
        setShowContent(e.target!.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setShowContent(file.name)
    }
  }

  const showContentDom = () => {
    if (file.type.includes('image')) {
      return <img src={showContent} alt="" />
    } else {
      return <div className={Style.file_name}>{showContent}</div>
    }
  }

  useEffect(() => {
    getContent()
  }, [])

  return <div className={Style.show_file_container}>
    {
      showContentDom()
    }
    <div>
      <Progress type="line" percent={uploadProgress}  size='small' />
    </div>
  </div>
}