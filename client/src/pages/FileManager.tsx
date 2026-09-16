import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Upload, File, Trash2, Download, FileText, FileImage } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

export default function FileManager() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<"receipt" | "document" | "license" | "other">("document");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // tRPC queries and mutations
  const { data: files, isLoading: filesLoading, refetch: refetchFiles } = trpc.files.list.useQuery();
  const uploadMutation = trpc.files.upload.useMutation();
  const deleteMutation = trpc.files.delete.useMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    try {
      const buffer = await selectedFile.arrayBuffer();
      await uploadMutation.mutateAsync({
        fileName: selectedFile.name,
        fileType,
        mimeType: selectedFile.type,
        fileSize: selectedFile.size,
        fileBuffer: new Uint8Array(buffer) as any,
        description: description || undefined,
      });

      toast.success("File uploaded successfully!");
      setSelectedFile(null);
      setDescription("");
      setFileType("document");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      refetchFiles();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: number) => {
    try {
      await deleteMutation.mutateAsync({ fileId });
      toast.success("File deleted successfully");
      refetchFiles();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete file");
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <FileImage className="w-5 h-5 text-blue-600" />;
    }
    return <FileText className="w-5 h-5 text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Document Manager</h1>
          <p className="text-lg text-slate-600">Upload and manage your parking documents, receipts, and licenses</p>
        </div>

        {/* Upload Section */}
        <Card className="p-8 mb-8 border-0 bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Upload New Document</h2>

          <div className="space-y-6">
            {/* File Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Select File</label>
              <div className="relative border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-blue-50">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-semibold text-slate-900">
                      {selectedFile ? selectedFile.name : "Click to select or drag and drop"}
                    </p>
                    {selectedFile && (
                      <p className="text-sm text-slate-600 mt-1">{formatFileSize(selectedFile.size)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* File Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Document Type</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as any)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="receipt">Parking Receipt</option>
                <option value="document">Document</option>
                <option value="license">Driver's License</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for this document..."
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
            >
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </Card>

        {/* Files List Section */}
        <Card className="p-8 border-0 bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Documents</h2>

          {filesLoading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading documents...</p>
            </div>
          ) : files && files.length > 0 ? (
            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {getFileIcon(file.mimeType)}
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{file.fileName}</p>
                      <div className="flex gap-4 text-sm text-slate-600">
                        <span>{formatFileSize(file.fileSize)}</span>
                        <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {file.fileType}
                        </span>
                        <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                      </div>
                      {file.description && (
                        <p className="text-sm text-slate-600 mt-2 italic">{file.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <File className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No documents uploaded yet</p>
              <p className="text-sm text-slate-500">Upload your first document using the form above</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
