'use client';

import { useState, useEffect } from 'react';
import { WarningType, NewRoomWarning } from '@/types/database.types';
import { createRoomWarning } from '@/utils/fetchers';
import { mutate } from 'swr';
import { useAuth } from '@/contexts/AuthContext';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AddWarningFormProps {
  roomId: string;
  onWarningAdded: () => void;
}

export default function AddWarningForm({ roomId, onWarningAdded }: AddWarningFormProps) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<NewRoomWarning>>({
    room_id: roomId,
    user_id: user?.id || "",
    severity: 3,
    description: "",
  });
  const [warningTypes, setWarningTypes] = useState<WarningType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWarningTypes = async () => {
      const { data, error } = await supabase
        .from("warning_types")
        .select(`id, name, description`);
      if (error) throw error;
      setWarningTypes(data!);
    };
    fetchWarningTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newWarning: NewRoomWarning = {
        room_id: roomId,
        user_id: user!.id,
        warning_type_id: formData.warning_type_id as string,
        severity: formData.severity as number,
        description: formData.description || null,
        created_at: new Date().toISOString(),
      };
      await createRoomWarning(newWarning);
      mutate(`warnings-${roomId}`);
      onWarningAdded();
      setShowForm(false);
      setFormData({
        room_id: roomId,
        user_id: user!.id,
        severity: 3,
        description: "",
      });
    } catch (error) {
      console.error("Error creating warning:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        {showForm ? "Cancel" : "Add Warning"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Warning Type
              </label>
              <select
                value={formData.warning_type_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, warning_type_id: e.target.value })
                }
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select a warning type</option>
                {warningTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.severity}
                onChange={(e) =>
                  setFormData({ ...formData, severity: parseInt(e.target.value) })
                }
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border rounded-md"
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {isLoading ? "Adding..." : "Add Warning"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
