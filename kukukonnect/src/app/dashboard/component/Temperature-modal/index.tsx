'use client';
import { useState } from "react";
import { TempModalProps } from "@/app/utils/types/tempModal";
import { error } from "console";

export default function TemperatureModal({
  minTemp,
  maxTemp,
  setMinTemp,
  setMaxTemp,
  optimumRange,
  closeModal,
  deviceId,
  onConfirm,
  minAllowed = 5,
  maxAllowed = 40,
}: TempModalProps) {
  const [successMessage, setSuccessMessage] = useState("");

  const currentOptimumMin = optimumRange ? optimumRange[0] : 32;
  const currentOptimumMax = optimumRange ? optimumRange[1] : 35;


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "minTemp") setMinTemp(Math.min(Number(value), maxTemp - 1));
    if (name === "maxTemp") setMaxTemp(Math.max(Number(value), minTemp + 1));
    setSuccessMessage("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await onConfirm(deviceId ?? "", minTemp, maxTemp);
      setSuccessMessage("Successfully changed optimum temperature!");
      setTimeout(() => {
        setSuccessMessage("");
        closeModal();
      }, 2000);
    } catch (error: any) {
      setSuccessMessage("");
      alert(`Failed to update temperature thresholds: ${error.message}`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-screen-sm md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto relative p-4 sm:p-6 md:p-10"
      >
        <h2 id="modal-title" className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-900 mb-4 text-center">
          Set Temperature
        </h2>
        <p className="text-emerald-900 text-center mb-6 sm:mb-8 text-base sm:text-lg">
          WARNING: Setting the wrong temperature can harm your flock.<br />
          Always set the temperature based on the chicks' age(see guide below).
          <br />The currently set optimum temperature range is <span className="font-semibold text-[#D2914A]">{currentOptimumMin}°C - {currentOptimumMax}°C</span>.
        </p>

        <div className="mb-6 sm:mb-8 p-4 bg-emerald-50 rounded-lg shadow-inner border border-emerald-200">
          <h3 className="text-lg sm:text-xl font-bold text-emerald-800 mb-3 text-center">
            Optimal Brooding Temperature by Age (Recommended)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-200">
              <thead className="bg-emerald-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                    Temperature (°C)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-emerald-200">
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-emerald-900">
                    Week 1
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-emerald-900"> 
                    32°C - 35°C
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-emerald-900">
                    Week 2 & 3
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-emerald-900">
                    29°C - 32°C
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-emerald-900">
                    Week 4
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-emerald-900">
                    27°C - 29°C
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-emerald-900">
                    Week 5+
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-emerald-900">
                    24°C - 27°C
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="border rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <span>
              <svg height={28} width={28} fill="none" viewBox="0 0 24 24">
                <path d="M12 2v14m0 0a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 0a4 4 0 0 1 0 8" stroke="#1C4532" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-lg sm:text-xl font-semibold text-emerald-900">Temperature Range</span>
            <span className="ml-auto font-bold text-emerald-900 text-lg sm:text-xl">{minTemp}°C - {maxTemp}°C</span>
          </div>
          <div className="flex flex-col xl:flex-row gap-x-8 gap-y-4 items-center">
            <div className="flex flex-col items-center w-full max-w-[140px]">
              <label className="mb-2 text-emerald-900 font-medium text-base sm:text-lg">Minimum (°C)</label>
              <input
                name="minTemp"
                type="number"
                min={minAllowed}
                max={maxTemp - 1}
                value={minTemp}
                onChange={handleChange}
                className="border rounded-md w-full max-w-[100px] text-center py-2 focus:outline-amber-600 text-base sm:text-lg"
              />
            </div>
            <input
              type="range"
              name="minTemp"
              min={minAllowed}
              max={maxAllowed}
              value={minTemp}
              onChange={handleChange}
              className="w-full accent-[#D2914A] my-2 sm:my-4"
            />
            <input
              type="range"
              name="maxTemp"
              min={minTemp + 1}
              max={maxAllowed}
              value={maxTemp}
              onChange={handleChange}
              className="w-full accent-[#D2914A] my-2 sm:my-4"
            />
            <div className="flex flex-col items-center w-full max-w-[140px]">
              <label className="mb-2 text-emerald-900 font-medium text-base sm:text-lg">Maximum (°C)</label>
              <input
                name="maxTemp"
                type="number"
                min={minTemp + 1}
                max={maxAllowed}
                value={maxTemp}
                onChange={handleChange}
                className="border rounded-md w-full max-w-[100px] text-center py-2 focus:outline-[#D2914A] text-base sm:text-lg"
              />
            </div>
          </div>
        </div>
        {successMessage && (
          <div className="mb-4 text-center font-semibold" style={{ color: "#084236" }}>
            {successMessage}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center">
          <button
            className="bg-[#D2914A] text-white rounded-lg px-8 py-2 sm:px-10 sm:py-3 font-semibold text-base sm:text-xl cursor-pointer"
            type="submit"
          >
            Confirm optimum Change
          </button>
          <button
            className="border border-amber-600 text-[#D2914A] rounded-lg px-8 py-2 sm:px-10 sm:py-3 font-semibold text-base sm:text-xl bg-white hover:bg-amber-50 cursor-pointer"
            type="button"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}