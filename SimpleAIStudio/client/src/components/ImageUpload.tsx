import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, CloudUpload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEventLogger } from "@/hooks/use-event-logger";

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void;
  onRemove: () => void;
}

export function ImageUpload({ onUpload, onRemove }: ImageUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { logEvent } = useEventLogger();

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setUploadedImage(imageUrl);
      onUpload(imageUrl);
    };
    reader.readAsDataURL(file);

    logEvent("image_uploaded", "image-upload", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleRemove = () => {
    setUploadedImage(null);
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    logEvent("image_removed", "image-upload");
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        id="image-upload-input"
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      {!uploadedImage ? (
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragOver 
              ? "border-blue-400 bg-blue-50" 
              : "border-gray-400 hover:border-gray-500"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CloudUpload className="h-6 w-6 mx-auto mb-1 text-gray-400" />
          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
        </div>
      ) : (
        <div className="relative">
          <img
            src={uploadedImage}
            alt="Uploaded preview"
            className="w-full h-24 object-cover rounded-lg border border-gray-200"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-1 right-1 h-6 w-6 p-0"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
