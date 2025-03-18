import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';

const CreateCustomerCard = () => {
  const [formData, setFormData] = useState({
    vorname: '',
    nachname: '',
    telefonnummer: '',
    mobil: '',
    adresse: '',
    plz: '',
    ort: '',
    geburtsdatum: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/kundenkarte/erstellen',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`Kundenkarte erstellt! Nummer: ${response.data.kundenkartennummer}`);
      setFormData({
        vorname: '',
        nachname: '',
        telefonnummer: '',
        mobil: '',
        adresse: '',
        plz: '',
        ort: '',
        geburtsdatum: '',
        email: '',
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Fehler beim Erstellen der Kundenkarte.');
    }
  };

  return (
    <Card className="max-w-4xl mx-auto mt-10 shadow-lg rounded-2xl bg-white">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-8 text-center">Kundenkarte erstellen</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Erste Spalte */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="vorname">Vorname</Label>
              <Input name="vorname" value={formData.vorname} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="telefonnummer">Telefonnummer</Label>
              <Input name="telefonnummer" value={formData.telefonnummer} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="adresse">Adresse</Label>
              <Input name="adresse" value={formData.adresse} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="geburtsdatum">Geburtsdatum</Label>
              <Input
                type="date"
                name="geburtsdatum"
                value={formData.geburtsdatum}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Zweite Spalte */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="nachname">Nachname</Label>
              <Input name="nachname" value={formData.nachname} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="mobil">Mobil</Label>
              <Input name="mobil" value={formData.mobil} onChange={handleChange} />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="plz">PLZ</Label>
                <Input name="plz" value={formData.plz} onChange={handleChange} required />
              </div>
              <div className="flex-1">
                <Label htmlFor="ort">Ort</Label>
                <Input name="ort" value={formData.ort} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Button über beide Spalten */}
          <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
            <Button type="submit" className="w-1/2">
              Kundenkarte erstellen
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCustomerCard;
