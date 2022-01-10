

export default class FileBufferObject {
    private static _maxFileSizeInBytes = 10 * 1024 * 1024;
    private _fileSizeInBytes: number;
    private _fileExtension: string;
    private _fileName: string;

    public constructor(fileSizeInBytes: number, fileExtension: string, fileName: string) {
        if (fileSizeInBytes > FileBufferObject._maxFileSizeInBytes || fileSizeInBytes <= 0)
            throw new Error(`The file for "${fileName}" must be a maximum of 10MB.`);
        this._fileSizeInBytes = fileSizeInBytes;
        this._fileExtension = fileExtension;
        this._fileName = fileName;
    }
}