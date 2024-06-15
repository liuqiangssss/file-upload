import Style from "./style.module.less";

interface IFileUpload {
    isMultiple?: boolean;
}

export const FileUpload: React.FC<IFileUpload> = ({ isMultiple = false }) => {
  return (
    <div className={Style.file_upload}>
        <div className={Style.upload_icon}>+</div>
      <input type="file" className={Style.input_button} multiple={isMultiple} onChange={(e) => {
        console.log(e.target.files);
        
      }} />
    </div>
  );
};
