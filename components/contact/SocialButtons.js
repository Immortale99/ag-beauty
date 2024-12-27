import { MessageCircle, Facebook } from 'lucide-react';

export default function SocialButtons() {
  const phoneNumber = "33626028745";
  const message = "Bonjour, je souhaite prendre rendez-vous.";
  const facebookUrl = "https://www.facebook.com/agbeauty42"; // Remplacez par votre URL Facebook
  
  const handleWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleFacebook = () => {
    window.open(facebookUrl, '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-4">
      <button
        onClick={handleWhatsApp}
        className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600"
        aria-label="Nous contacter sur WhatsApp"
      >
        <MessageCircle size={24} />
      </button>
      
      <button
        onClick={handleFacebook}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
        aria-label="Nous suivre sur Facebook"
      >
        <Facebook size={24} />
      </button>
    </div>
  );
}