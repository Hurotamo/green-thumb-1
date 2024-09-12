import Image from "next/image";
import styles from "./landingPage.module.css";
import BackgroundImage from "../background/background";

export default function FormMdal() {
  return (
    <>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-4 -mt-10 h-80 overflow-y-scroll">
        <div className="border-b border-gray-200 py-4">
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Profile Name
          </label>
          <input
            className="w-full bg-transparent text-gray-600 focus:outline-none"
            type="text"
            placeholder="Input Name"
          />
        </div>

        <div className="border-b border-gray-200 py-4">
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Wallet Address
          </label>
          <input
            className="w-full bg-transparent text-gray-600 focus:outline-none"
            type="text"
            placeholder="Input Wallet Address"
          />
        </div>

        <div className="border-b border-gray-200 py-4">
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Email Address
          </label>
          <input
            className="w-full bg-transparent text-gray-600 focus:outline-none"
            type="email"
            placeholder="example@gmail.com"
          />
        </div>

        <div className="border-b border-gray-200 py-4 flex items-center justify-between">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Age
            </label>
            <input
              className="bg-transparent text-gray-600 focus:outline-none"
              type="number"
              placeholder="Input your age"
            />
          </div>
          <span className="text-gray-400">{">"}</span>
        </div>

        <div className="border-b border-gray-200 py-4 flex items-center justify-between">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Gender
            </label>
            <input
              className="bg-transparent text-gray-600 focus:outline-none"
              type="text"
              placeholder="Select gender"
            />
          </div>
          <span className="text-gray-400">{">"}</span>
        </div>

        <div className="border-b border-gray-200 py-4 flex items-center justify-between">
          <div>
            <label className="block text-gray-700 text-sm  mb-1">
              Category Area
            </label>
            <input
              className="bg-transparent text-gray-600 focus:outline-none"
              type="text"
              placeholder="Plots,Backyard,etc."
            />
          </div>
          <span className="text-gray-400">{">"}</span>
        </div>

        <div className="border-b border-gray-200 py-4 flex items-center justify-between">
          <div>
            <label className="block text-gray-700 text-sm  mb-1">
              Category Plants
            </label>
            <input
              className="bg-transparent text-gray-600 focus:outline-none"
              type="text"
              placeholder="Vegetables,Crops,Leaf,etc"
            />
          </div>
          <span className="text-gray-400">{">"}</span>
        </div>

        <div className="border-b border-gray-200 py-4 flex items-center justify-between">
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Methods of Planting
            </label>
            <input
              className="bg-transparent text-gray-600 focus:outline-none"
              type="text"
              placeholder="Aquaponics,Raised Bed,Container,Etc."
            />
          </div>
          <span className="text-gray-400">{">"}</span>
        </div>
      </div>
      <div className="text-center">
        <button className="bg-green-700  text-black font-medium py-1 px-4 rounded-full mt-6">
          Submit
        </button>
      </div>
      <div>
        <h1 className={styles.right}>All Rights Reserved 2024</h1>
      </div>
    </>
  );
}
