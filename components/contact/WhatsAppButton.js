import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  // Remplacez ce numéro par le numéro WhatsApp de votre femme
  const phoneNumber = "33626028745";
  const message = "Bonjour, je souhaite prendre rendez-vous.";
  
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 flex items-center gap-2"
      aria-label="Nous contacter sur WhatsApp"
    >
      <MessageCircle size={24} />
    </button>
  );
}