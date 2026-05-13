import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Trash2, Mail, Phone, User } from "lucide-react";

interface ContactRequest {
  id: string;
  full_name: string;
  phone_number: string;
  email_address: string;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "resolved";
}

export default function ContactManagement() {

  const api = import.meta.env.VITE_API_BASE_URL;

  const [data, setData] = useState<ContactRequest[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/contact_requests/list`);
      setData(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      setStatusLoading(id);

      await axios.put(`${api}/contact_requests/${id}`, {
        status
      });

      fetchData();
    } finally {
      setStatusLoading(null);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setDeleteLoading(id);

      await axios.delete(`${api}/contact_requests/${id}`);

      setData(prev => prev.filter(x => x.id !== id));

    } finally {
      setDeleteLoading(null);
    }
  };

  const filtered = data.filter(item =>
    item.full_name.toLowerCase().includes(search.toLowerCase()) ||
    item.email_address.toLowerCase().includes(search.toLowerCase()) ||
    item.phone_number.includes(search)
  );

  return (
    <div className="h-full">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold text-[#2d4863]">
          Contact Requests
        </h1>

        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D73D32]"
          />
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border">

        {/* HEADER ROW */}
        <div className="grid grid-cols-6 bg-[#2d4863] text-white text-sm font-semibold p-4">
          <div>User</div>
          <div>Contact</div>
          <div>Subject</div>
          <div>Status</div>
          <div>Message</div>
          <div>Action</div>
        </div>

        {/* BODY */}
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading...
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-6 items-center p-4 border-b hover:bg-gray-50 transition"
            >

              {/* USER */}
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#D73D32]" />
                <span className="font-medium text-[#2d4863]">
                  {item.full_name}
                </span>
              </div>

              {/* CONTACT */}
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#D73D32]" />
                  {item.phone_number}
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#EC7063]" />
                  {item.email_address}
                </div>
              </div>

              {/* SUBJECT */}
              <div className="text-sm font-medium text-gray-700">
                {item.subject}
              </div>

              {/* STATUS DROPDOWN */}
              <div>
                <select
                  value={item.status}
                  disabled={statusLoading === item.id}
                  onChange={(e) =>
                    updateStatus(item.id, e.target.value)
                  }
                  className={`
                    px-3 py-1 rounded-lg text-sm border
                    ${item.status === "new" ? "bg-[#EC7063]/20 text-[#D73D32]" : ""}
                    ${item.status === "in_progress" ? "bg-yellow-100 text-yellow-700" : ""}
                    ${item.status === "resolved" ? "bg-green-100 text-green-700" : ""}
                  `}
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {/* MESSAGE */}
              <div className="text-xs text-gray-500 line-clamp-2">
                {item.message}
              </div>

              {/* ACTION */}
              <div>
                <button
                  onClick={() => deleteItem(item.id)}
                  disabled={deleteLoading === item.id}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}