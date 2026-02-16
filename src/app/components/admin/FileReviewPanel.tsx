import { useState } from "react";
import { CheckCircle, XCircle, FileText, Image, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function FileReviewPanel() {
  const [selectedFile, setSelectedFile] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const files = [
    {
      id: 1,
      orderId: "ORD-2024-156",
      customer: "Rahul Sharma",
      product: "Business Cards",
      fileName: "business-card-design.pdf",
      fileType: "PDF",
      uploadDate: "Feb 13, 2026 10:30 AM",
      status: "pending",
      fileSize: "2.4 MB",
    },
    {
      id: 2,
      orderId: "ORD-2024-155",
      customer: "Priya Patel",
      product: "Brochures",
      fileName: "brochure-design.ai",
      fileType: "AI",
      uploadDate: "Feb 12, 2026 3:45 PM",
      status: "pending",
      fileSize: "8.7 MB",
    },
    {
      id: 3,
      orderId: "ORD-2024-154",
      customer: "Amit Kumar",
      product: "Banners",
      fileName: "banner-artwork.psd",
      fileType: "PSD",
      uploadDate: "Feb 11, 2026 11:20 AM",
      status: "approved",
      fileSize: "15.2 MB",
    },
    {
      id: 4,
      orderId: "ORD-2024-153",
      customer: "Sneha Gupta",
      product: "Flyers",
      fileName: "flyer-design.jpg",
      fileType: "JPG",
      uploadDate: "Feb 10, 2026 2:15 PM",
      status: "rejected",
      fileSize: "3.1 MB",
      comment: "Resolution too low. Please upload at least 300 DPI.",
    },
  ];

  const pendingFiles = files.filter(f => f.status === "pending");
  const approvedFiles = files.filter(f => f.status === "approved");
  const rejectedFiles = files.filter(f => f.status === "rejected");

  const handleApprove = (fileId: number) => {
    console.log("Approved file:", fileId);
    setSelectedFile(null);
    setComment("");
  };

  const handleReject = (fileId: number) => {
    if (!comment.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    console.log("Rejected file:", fileId, "Comment:", comment);
    setSelectedFile(null);
    setComment("");
  };

  const FileCard = ({ file }: { file: typeof files[0] }) => {
    const isSelected = selectedFile === file.id;
    const FileIcon = file.fileType === "PDF" ? FileText : Image;

    return (
      <Card 
        className={`bg-white p-6 shadow-sm border-0 cursor-pointer transition-all ${
          isSelected ? "ring-2 ring-[#D73D32]" : ""
        }`}
        onClick={() => setSelectedFile(file.id)}
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileIcon className="w-8 h-8 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-[#1A1A1A] mb-1 truncate">{file.fileName}</h3>
                <p className="text-sm text-gray-600">{file.product}</p>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                file.status === "approved" 
                  ? "bg-green-100 text-green-700"
                  : file.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="text-gray-500">Order:</span>{" "}
                <span className="text-[#D73D32] font-medium">{file.orderId}</span>
              </div>
              <div>
                <span className="text-gray-500">Customer:</span>{" "}
                <span className="text-[#1A1A1A]">{file.customer}</span>
              </div>
              <div>
                <span className="text-gray-500">Size:</span>{" "}
                <span className="text-[#1A1A1A]">{file.fileSize}</span>
              </div>
              <div>
                <span className="text-gray-500">Uploaded:</span>{" "}
                <span className="text-[#1A1A1A]">{file.uploadDate}</span>
              </div>
            </div>
            {file.comment && (
              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{file.comment}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">File Review Panel</h1>
        <p className="text-gray-600">Review uploaded print files from customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white p-6 shadow-sm border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingFiles.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        <Card className="bg-white p-6 shadow-sm border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-3xl font-bold text-green-600">{approvedFiles.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="bg-white p-6 shadow-sm border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{rejectedFiles.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* File List */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="pending">
            <TabsList className="mb-6">
              <TabsTrigger value="pending">
                Pending ({pendingFiles.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedFiles.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedFiles.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingFiles.map((file) => (
                <FileCard key={file.id} file={file} />
              ))}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              {approvedFiles.map((file) => (
                <FileCard key={file.id} file={file} />
              ))}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {rejectedFiles.map((file) => (
                <FileCard key={file.id} file={file} />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Review Panel */}
        <div className="lg:col-span-1">
          <Card className="bg-white p-6 shadow-md border-0 sticky top-24">
            {selectedFile ? (
              <div>
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">File Preview & Review</h2>
                
                {/* Preview Area */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">File preview</p>
                  </div>
                </div>

                {/* Comment Box */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-[#1A1A1A] mb-2">
                    <MessageSquare className="w-4 h-4" />
                    Comment / Correction Notes
                  </label>
                  <Textarea
                    placeholder="Add notes for approval or specify corrections needed..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="bg-white border-gray-200"
                  />
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleApprove(selectedFile)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve File
                  </Button>
                  <Button 
                    className="w-full bg-[#D73D32] hover:bg-[#D73D32]/90 text-white"
                    onClick={() => handleReject(selectedFile)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject & Request Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-200"
                    onClick={() => {
                      setSelectedFile(null);
                      setComment("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Select a file to review</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
