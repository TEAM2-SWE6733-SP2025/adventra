/* eslint-disable no-console */
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("photo");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    };

    await s3.upload(params).promise();

    const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return new Response(
      JSON.stringify({
        message: "File uploaded successfully!",
        fileUrl: publicUrl,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    const { key } = await req.json();

    if (!key) {
      return new Response(JSON.stringify({ error: "No key provided" }), {
        status: 400,
      });
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };

    await s3.deleteObject(params).promise();

    return new Response(
      JSON.stringify({ message: "File deleted successfully!" }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete error:", error);
    return new Response(JSON.stringify({ error: "Delete failed" }), {
      status: 500,
    });
  }
}
