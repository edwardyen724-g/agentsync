import React from 'react';
import { useSession } from 'next-auth/react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../lib/firebase'; // Assuming you have initialized your Firebase app in this file

const db = getFirestore(app);

const SettingsPage: React.FC = () => {
  const { data: session } = useSession();
  const [settings, setSettings] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (!session?.user) throw new Error("User not authenticated");

        const settingsSnapshot = await getDocs(collection(db, 'settings'));
        const settingsList = settingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSettings(settingsList);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [session]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Settings</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Manage Your Settings</h2>
        <ul>
          {settings.map(setting => (
            <li key={setting.id} className="py-2 border-b">
              <span className="font-medium">{setting.name}: </span>
              <span>{setting.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SettingsPage;