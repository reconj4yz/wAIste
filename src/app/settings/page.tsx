'use client'
import { useEffect, useState } from 'react'
import { User, Mail, Phone, Home, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db/dbConfig'
import { Users } from '@/utils/db/schema'
import { eq } from 'drizzle-orm'

type UserSettings = {
  name: string
  email: string
  phone: number
  address: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
      fetchUserData(storedEmail);
    }
  }, []);

  const fetchUserData = async (email: string) => {
    try {
      const user = await db.select().from(Users).where(eq(Users.email, email)).execute();
      if (user.length > 0) {
        setSettings({
          name: user[0].name || '',
          email: user[0].email || '',
          phone: user[0].phone || +91,
          address: user[0].address || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      await db.update(Users)
        .set({ name: settings.name, phone: settings.phone, address: settings.address })
        .where(eq(Users.email, settings.email))
        .execute();

      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  if (!settings) {
    return <div className="p-8 max-w-2xl mx-auto text-center">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Account Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={settings.name}
              onChange={handleInputChange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your full name"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={settings.email}
              disabled
              className="pl-10 w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md cursor-not-allowed"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div className="relative">
            <input
              type="text"
              id="phone"
              name="phone"
              value={settings.phone}
              onChange={handleInputChange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your phone number"
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <div className="relative">
            <input
              type="text"
              id="address"
              name="address"
              value={settings.address}
              onChange={handleInputChange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your address"
            />
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </form>
    </div>
  );
}
