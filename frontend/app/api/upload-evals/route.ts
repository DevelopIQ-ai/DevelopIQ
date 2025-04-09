// File: app/api/upload-to-s3/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    
    // Get the file from the request
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Get property address and reviewer name from fields
    const propertyAddress = formData.get('propertyAddress') as string || 'Unknown Address';
    const reviewerName = formData.get('reviewerName') as string || 'Anonymous';
    
    // Format the property address for the file path (remove non-alphanumeric characters)
    const formattedAddress = propertyAddress.replace(/[^a-zA-Z0-9]/g, '_');
    
    // Create a timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Create S3 key for root storage (no folder structure)
    const s3Key = `${formattedAddress}-${reviewerName.replace(/\s+/g, '-')}-${timestamp}.xlsx`;
    
    // Initialize S3 client
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    
    // Get file buffer to upload directly from the file object
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    
    // Upload to S3
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    // Create the file URL (direct to root bucket)
    const fileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${s3Key}`;
    
    // Return success response
    return NextResponse.json({
      success: true,
      fileUrl,
      key: s3Key,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}