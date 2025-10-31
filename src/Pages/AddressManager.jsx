import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import L from "leaflet";
import axios from "axios";
import {
  FaArrowLeft,
  FaSave,
  FaTrash,
  FaMapMarkerAlt,
  FaLocationArrow,
} from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import {
  addAddress,
  deleteAddress,
  setAddresses,
} from "../features/Address/addressSlice";

// ✅ Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ✅ Subcomponent for selecting location on map
const LocationPicker = ({ marker, setMarker, onMapClick }) => {
  useMapEvents({
    click(e) {
      setMarker(e.latlng);
      onMapClick(e.latlng);
    },
  });
  return marker ? <Marker position={marker} /> : null;
};

const AddressManager = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const addresses = useSelector((state) => state.address.addresses);

  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
  });
  const [loadingLocation, setLoadingLocation] = useState(true);

  // ✅ Fetch saved addresses from localStorage when page loads
  useEffect(() => {
    const stored = localStorage.getItem("userAddresses");
    if (stored) dispatch(setAddresses(JSON.parse(stored)));
  }, [dispatch]);

  // ✅ Auto-fetch user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMarker(userPos);
          reverseGeocode(userPos);
          setLoadingLocation(false);
        },
        (error) => {
          console.warn("Geolocation denied or failed:", error);
          setMarker({ lat: 51.505, lng: -0.09 });
          setLoadingLocation(false);
        }
      );
    } else {
      setMarker({ lat: 51.505, lng: -0.09 });
      setLoadingLocation(false);
    }
  }, []);

  const reverseGeocode = async (coords) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`
      );
      const data = res.data.address;
      setAddress({
        street:
          data.road ||
          data.residential ||
          data.neighbourhood ||
          "Unknown Street",
        city: data.city || data.town || data.village || "Unknown City",
        postalCode: data.postcode || "",
      });
    } catch (err) {
      console.error("Reverse geocode failed:", err);
    }
  };

  const handleMapClick = (coords) => {
    reverseGeocode(coords);
  };

  // ✅ Save new address to Redux + localStorage
  const handleSave = () => {
    if (!address.street || !marker)
      return alert("Please select a location!");

    const newAddress = {
      id: Date.now(),
      ...address,
      location: marker,
    };

    dispatch(addAddress(newAddress));
    setAddress({ street: "", city: "", postalCode: "" });
  };

  // ✅ Delete address via Redux
  const handleDelete = (id) => {
    dispatch(deleteAddress(id));
  };

  if (loadingLocation)
    return (
      <div className="flex items-center justify-center h-screen dark:bg-zinc-900 transition-colors">
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">
          Detecting your location...
        </p>
      </div>
    );

  return (
    <div
      className={`max-w-8xl mx-auto py-10 px-6 mt-5 transition-colors duration-500 ${
        mode === "dark"
          ? "bg-zinc-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-purple-600 hover:underline"
      >
        <FaArrowLeft /> Back
      </button>

      <h1 className="text-3xl font-bold mb-6 mt-4 text-center">
        Manage Addresses
      </h1>

      <div
        className={`p-6 rounded-2xl shadow-lg mb-8 transition-colors duration-500 ${
          mode === "dark" ? "bg-zinc-800 text-gray-100" : "bg-white"
        }`}
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaMapMarkerAlt className="text-purple-600" /> Add New Address
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Street"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />
          <input
            type="text"
            placeholder="City"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
          <input
            type="text"
            placeholder="Postal Code"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            value={address.postalCode}
            onChange={(e) =>
              setAddress({ ...address, postalCode: e.target.value })
            }
          />
        </div>

        <div className="rounded-lg overflow-hidden shadow-md mb-6 relative">
          <MapContainer
            center={marker}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
            className="rounded-lg border dark:border-zinc-700"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationPicker
              marker={marker}
              setMarker={setMarker}
              onMapClick={handleMapClick}
            />
          </MapContainer>

          <button
            onClick={() => {
              if (marker) {
                navigator.geolocation.getCurrentPosition((pos) => {
                  const userPos = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                  };
                  setMarker(userPos);
                  reverseGeocode(userPos);
                });
              }
            }}
            className="absolute bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-all"
          >
            <FaLocationArrow />
          </button>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          <FaSave /> Save Address
        </button>
      </div>

      {/* ✅ Saved Addresses */}
      {addresses.length > 0 && (
        <div
          className={`p-6 rounded-2xl shadow-lg transition-colors duration-500 ${
            mode === "dark" ? "bg-zinc-800 text-gray-100" : "bg-white"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4">Saved Addresses</h2>
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="flex justify-between items-center border rounded-lg p-4 hover:shadow-md transition-all dark:border-zinc-700"
              >
                <div>
                  <p className="font-semibold">
                    {addr.street}, {addr.city}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {addr.postalCode} — Lat: {addr.location.lat.toFixed(3)}, Lng:{" "}
                    {addr.location.lng.toFixed(3)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManager;
