import React from 'react';

export default function BookingSystem() {
  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="text-center py-12 space-y-6">
        <h2 className="text-2xl font-bold">Réservez votre rendez-vous</h2>
        <div className="bg-pink-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-6">
            Pour vous offrir une meilleure expérience, nous utilisons maintenant Planity 
            pour la gestion de nos rendez-vous. Vous pourrez :
          </p>
          <ul className="text-left text-gray-600 mb-8 space-y-2">
            <li>• Voir toutes nos disponibilités en temps réel</li>
            <li>• Gérer facilement vos rendez-vous</li>
            <li>• Recevoir des rappels automatiques</li>
          </ul>
          <a 
            href="https://www.planity.com/ag-beauty-42230-roche-la-moliere" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-medium px-8 py-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            aria-label="Accéder à notre page de réservation Planity"
          >
            Prendre rendez-vous
          </a>
        </div>
      </div>
    </div>
  );
}