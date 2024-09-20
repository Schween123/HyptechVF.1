import { Helmet } from "react-helmet";
import { Button, Heading } from "../../../components";
import BHInfoRoom from "../../../components/BHInfoRoom/bhInfoRoom.tsx";
import { Suspense, useState, useEffect } from 'react';
import DoneBHRegistration from "../../../components/DoneBHRegistration/DoneBHRegistration.tsx";
import { useLocation } from 'react-router-dom';

const globalStyles = `
  body, html {
    background-color: #C5C3C6; 
    height: 100%;
    margin: 0;
  }
  #root, .app {
    height: 100%;
  } 
`;

interface RoomData {
  roomnumber: string;
  capacity: number;
}

export default function BHInfoPage() {
  const location = useLocation();
  const { bhrooms, boardingHouseId } = location.state || { bhrooms: 0, boardingHouseId: null };
  const [showPopup, setShowPopup] = useState(false);
  const [roomData, setRoomData] = useState<RoomData[]>([]);

  useEffect(() => {
    const rooms: RoomData[] = Array.from({ length: bhrooms }, (_, index) => ({
      roomnumber: `Room ${index + 1}`,
      capacity: 0 // Initialize the capacity as an empty string
    }));
    setRoomData(rooms);
  }, [bhrooms]);

  const handleDoneClick = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/rooms/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData.map(room => ({
          room_number: room.roomnumber,
          capacity: room.capacity,
          boarding_house: boardingHouseId, // Include the boarding house ID
        }))),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Data successfully sent:', responseData);
        setShowPopup(true);
      } else {
        const errorData = await response.json();
        console.error('Failed to save room data:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const updateRoomData = (index: number, field: keyof RoomData, value: string) => {
    const newRoomData = [...roomData];
    if (field === "capacity") {
      // Parse the string to number when updating 'capacity'
      const numericValue = Number(value);
      newRoomData[index][field] =isNaN(numericValue) ? 0 : numericValue; 
    } else {
      // Handle 'roomnumber' as a string directly
      newRoomData[index][field] = value;
  }
    setRoomData(newRoomData);
  };

  return (
    <>
      <Helmet>
        <title>HypTech</title>
        <meta name="description" content="Web site created using create-react-app" />
        <style>{globalStyles}</style>
      </Helmet>
      <div className="flex w-full flex-col items-center justify-center border border-solid border-white-A700 py-[47px] md:py-5">
        <div className="container-xs flex flex-col items-start p-5">
          <div className="flex flex-col items-start gap-2">
            <Heading as="h1" className="text-xl md:text-2xl lg:text-3xl tracking-[9.00px] !text-black-900">
              BOARDING HOUSE NAME
            </Heading>
            <Heading size="xs" as="h2" className="text-sm md:text-lg lg:text-xl tracking-[7.00px] !text-cyan-800">
              Room Information
            </Heading>
          </div>
          <div className="mt-[86px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[27px] w-[94%]">
            <Suspense fallback={<div>Loading feed...</div>}>
              {roomData.map((d, index) => (
                <BHInfoRoom 
                  key={"bhinfo" + index} 
                  roomnumber={d.roomnumber} 
                  capacity={d.capacity} 
                  onUpdate={(field, value) => updateRoomData(index, field, value)}
                />
              ))}
            </Suspense>         
          </div>
          <Button
            color="blue_gray_100"
            shape="square"
            className="self-end mr-[31px] mt-12 px-5 py-2 text-sm sm:text-base md:min-w-[193px] md:text-lg lg:text-xl border-[5px] border-solid border-cyan-800 font-montserrat font-semibold md:mr-0"
            onClick={handleDoneClick}
          >
            DONE
          </Button>   
        </div>
      </div>
      {showPopup && <DoneBHRegistration onClose={handleClosePopup} />}
    </>
  );
}
