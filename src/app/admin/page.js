"use client";
import { useState, useEffect } from 'react';
import { CldUploadWidget } from 'next-cloudinary';

export default function AdminPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/images');
      const data = await res.json();
      setImages(data);
    } catch (error) {
      console.error("Gagal mengambil gambar", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Fungsi Hapus Gambar
  const handleDelete = async (public_id) => {
    // Konfirmasi agar tidak tidak sengaja terhapus
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus gambar ini?");
    if (!confirmDelete) return;

    try {
      // Ganti teks tombol atau beri indikasi loading (opsional)
      const res = await fetch('/api/images', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id })
      });

      if (res.ok) {
        alert("Gambar berhasil dihapus!");
        fetchImages(); // Memuat ulang daftar gambar secara otomatis
      } else {
        alert("Terjadi kesalahan saat menghapus gambar.");
      }
    } catch (error) {
      console.error("Error menghapus gambar:", error);
    }
  };

  return (
    <div className="p-10 font-sans max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Halaman Admin Slideshow</h1>
      <p className="mb-6 text-gray-600">Kelola gambar untuk tayangan TV kantor Anda.</p>
      
      <div className="mb-8">
        <CldUploadWidget 
          signatureEndpoint="/api/sign-cloudinary-params"
          options={{ folder: "slideshow-tv" }}
          onSuccess={(result) => {
            fetchImages();
          }}
        >
          {({ open }) => (
            <button 
              onClick={() => open()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition font-medium"
            >
              + Upload Gambar Baru
            </button>
          )}
        </CldUploadWidget>
      </div>

      <hr className="mb-8" />

      <h2 className="text-xl font-semibold mb-4">Daftar Gambar Saat Ini</h2>
      {loading ? (
        <p className="text-gray-500">Memuat gambar...</p>
      ) : images.length === 0 ? (
        <p className="text-gray-500">Belum ada gambar yang di-upload.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img.public_id} className="border rounded-lg p-4 shadow-sm bg-white flex flex-col">
              <img 
                src={img.secure_url} 
                alt="Slideshow" 
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <div className="flex-grow">
                <p className="text-xs text-gray-500 truncate mb-1" title={img.public_id}>
                  {img.public_id.split('/').pop()} {/* Menampilkan nama file saja */}
                </p>
                <span className="inline-block text-xs bg-green-100 text-green-800 px-2 py-1 rounded mb-3">Aktif</span>
              </div>
              
              {/* Tombol Hapus */}
              <button 
                onClick={() => handleDelete(img.public_id)}
                className="w-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 py-2 rounded transition text-sm font-medium"
              >
                Hapus Gambar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}