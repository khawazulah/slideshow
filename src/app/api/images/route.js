import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
      try {
        // Mengambil daftar gambar HANYA dari folder tertentu
        const result = await cloudinary.search
          .expression('resource_type:image AND folder:slideshow-tv') 
          .sort_by('created_at', 'desc')
          .max_results(30)
          .execute();

        return Response.json(result.resources);
      } catch (error) {
        return Response.json({ error: "Gagal memuat gambar" }, { status: 500 });
      }
    }

// FUNGSI MENGHAPUS GAMBAR BARU DIBAWAH INI
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { public_id } = body; // public_id adalah "KTP" dari gambar di Cloudinary

    if (!public_id) {
      return Response.json({ error: "ID Gambar tidak ditemukan" }, { status: 400 });
    }

    // Perintah untuk menghapus dari server Cloudinary
    await cloudinary.uploader.destroy(public_id);
    
    return Response.json({ message: "Gambar berhasil dihapus" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Gagal menghapus gambar" }, { status: 500 });
  }
}