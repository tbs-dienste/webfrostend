import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';

const AddPoints = () => {
  const [kundenkartennummer, setKundenkartennummer] = useState('');
  const [einkaufsbetrag, setEinkaufsbetrag] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/kundenkarte/addPoints',
        { kundenkartennummer, einkaufsbetrag },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      setKundenkartennummer('');
      setEinkaufsbetrag('');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Fehler beim Punkte nachtragen.');
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10 shadow-lg rounded-2xl bg-white">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-8 text-center">Punkte nachtragen</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kundenkartennummer */}
          <div className="col-span-1 md:col-span-2">
            <Label htmlFor="kundenkartennummer">Kundenkartennummer</Label>
            <Input
              type="text"
              value={kundenkartennummer}
              onChange={(e) => setKundenkartennummer(e.target.value)}
              required
            />
          </div>

          {/* Einkaufsbetrag */}
          <div className="col-span-1 md:col-span-2">
            <Label htmlFor="einkaufsbetrag">Einkaufsbetrag (CHF)</Label>
            <Input
              type="number"
              value={einkaufsbetrag}
              onChange={(e) => setEinkaufsbetrag(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
            <Button type="submit" className="w-1/2">
              Punkte hinzufügen
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddPoints;
