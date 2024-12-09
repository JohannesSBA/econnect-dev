"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { checkImageExists } from "@/app/helpers/checkImage";

interface PostImagesProps {
    images: string[];
    authorId: string;
}

const PostImages = ({ images, authorId }: PostImagesProps) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [validImageUrls, setValidImageUrls] = useState<string[]>([]);

    useEffect(() => {
        // Generate indexed image URLs
        const imageUrls: string[] = [];
        for (let index = 0; index < 3; index++) {
            imageUrls.push(
                `https://econnectbucket.s3.us-east-1.amazonaws.com/newPostImage/${authorId}/${images}/${index}`
            );
        }

        // Validate image URLs
        const validateImages = async () => {
            const validUrls: string[] = [];
            for (const url of imageUrls) {
                if (await checkImageExists(url)) {
                    validUrls.push(url);
                }
            }
            setValidImageUrls(validUrls);
        };

        validateImages();
    }, [images, authorId]);

    // Render nothing if no valid images
    if (validImageUrls.length === 0) return null;

    return (
        <>
            <div className="grid grid-cols-2 gap-2 mb-4">
                {/* First image takes full height */}
                {validImageUrls[0] && (
                    <div className="row-span-2">
                        <img
                            src={validImageUrls[0]}
                            alt="Post content 1"
                            className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedImage(validImageUrls[0])}
                        />
                    </div>
                )}
                {/* Two smaller images on the right */}
                <div className="grid gap-2">
                    {validImageUrls[1] && (
                        <img
                            src={validImageUrls[1]}
                            alt="Post content 2"
                            className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedImage(validImageUrls[1])}
                        />
                    )}
                    {validImageUrls[2] && (
                        <img
                            src={validImageUrls[2]}
                            alt="Post content 3"
                            className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedImage(validImageUrls[2])}
                        />
                    )}
                </div>
            </div>

            <Dialog
                open={!!selectedImage}
                onOpenChange={() => setSelectedImage(null)}
            >
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black">
                    <img
                        src={selectedImage || ""}
                        alt="Enlarged post content"
                        className="w-full h-auto max-h-[80vh] object-contain"
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default PostImages;
