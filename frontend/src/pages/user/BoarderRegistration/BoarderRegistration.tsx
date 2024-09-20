import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { Text, Heading } from "../../../components";
import { useNavigate } from "react-router-dom";
import OnScreenKeyboard, {
  OnScreenKeyboardHandle,
} from "../../../components/OnScreenKeyboard/OnScreenKeyboard";

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

export default function BoarderRegistration1Page() {
  const navigate = useNavigate();
  const keyboardRef = useRef<OnScreenKeyboardHandle>(null);

  const [formData, setFormData] = useState({
    boarderfirstname: "",
    boardermiddlename: "",
    boarderlastname: "",
    boardergender: "",
    boarderage: "",
    boarderaddress: "",
    boardercontactnumber: "",
    boardercourse_profession: "",
    boarderinstitution: "",
    boarding_house: 1, // Assuming you have a boarding house with ID 1, update as necessary
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/tenant/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Tenant data saved successfully:", responseData);
        navigate("/guardianregistration", {
          state: { tenantId: responseData.id },
        }); // Navigate to the next page with tenant ID
      } else {
        const errorData = await response.json();
        console.error("Failed to save tenant data:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    if (keyboardRef.current) {
      keyboardRef.current.show(input);
    }
  };

  return (
    <>
      <Helmet>
        <title>HypTech</title>
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        <style>{globalStyles}</style>
      </Helmet>
      <form onSubmit={handleSubmit}>
        <div className="flex w-full justify-center border border-solid border-white-A700 py-[50px] md:py-2">
          <div className="container-xs mb-[23px] flex justify-center md:p-5">
            <div className="flex w-full flex-col gap-[142px] md:gap-[106px] sm:gap-[71px]">
              <div className="flex flex-col items-center gap-2 px-[30px] sm:px-5">
                <Heading
                  as="h1"
                  className="!font-montserrat tracking-[9.00px] ! text-black-900"
                >
                  WELCOME TO BOARDING HOUSE NAME
                </Heading>
                <div className="h-px self-stretch bg-cyan-800" />
              </div>
              <div className="flex w-full justify-between gap-[120px] mt-[-50px]">
                {/* Left Side */}
                <div className="flex w-[48%] flex-col items-start">
                  <div className="ml-[33px] flex w-full flex-col items-start md:ml-0">
                    <Text
                      size="md"
                      as="p"
                      className="relative z-[1] !font-open-sans tracking-[2.50px]"
                    >
                      Name
                    </Text>
                    <div className="relative mt-[-2px] flex gap-[17px] self-stretch">
                      <input
                        onFocus={handleFocus}
                        name="boarderfirstname"
                        value={formData.boarderfirstname}
                        onChange={handleChange}
                        className="w-[220px] border-b-2 border-customColor1 pb-[-30px] pt-[30px] !text-xl mt-[-10px]"
                      />
                      <input
                        onFocus={handleFocus}
                        name="boardermiddlename"
                        value={formData.boardermiddlename}
                        onChange={handleChange}
                        className="w-[66px] border-b-2 border-customColor1 pb-[-30px] pt-[30px] !text-xl mt-[-10px]"
                      />
                      <input
                        onFocus={handleFocus}
                        name="boarderlastname"
                        value={formData.boarderlastname}
                        onChange={handleChange}
                        className="w-[220px] border-b-2 border-customColor1 pb-[-30px] pt-[30px] !text-xl mt-[-10px]"
                      />
                    </div>
                    {/* Gender and Age Section */}
                    <div className="mt-5 flex flex-col md:flex-row items-start justify-between gap-[30px]">
                      {/* Gender Section */}
                      <div className="flex flex-col items-start">
                        <Text
                          size="md"
                          as="p"
                          className="!font-open-sans tracking-[2.50px] mb-1"
                        >
                          Gender
                        </Text>
                        <div className="flex items-center gap-2">
                          <input
                            onFocus={handleFocus}
                            name="boardergender"
                            value={formData.boardergender}
                            onChange={handleChange}
                            className="relative w-[220px] border-b-2 border-customColor1 pb-[-30px] pt-[30px] !text-xl mt-[-10px]"
                          />
                        </div>
                      </div>
                      {/* Age Section */}
                      <div className="flex flex-col items-start mt-1 md:mt-0">
                        <Text
                          size="md"
                          as="p"
                          className="!font-open-sans tracking-[2.50px] mb-1"
                        >
                          Age
                        </Text>
                        <div className="flex items-center gap-2">
                          <input
                            onFocus={handleFocus}
                            name="boarderage"
                            value={formData.boarderage}
                            onChange={handleChange}
                            className="relative w-[220px] border-b-2 border-customColor1 pb-[-30px] pt-[30px] !text-xl mt-[-10px]"
                          />
                        </div>
                      </div>
                    </div>
                    <Text
                      size="md"
                      as="p"
                      className="mt-[25px] !font-open-sans tracking-[2.50px]"
                    >
                      Address
                    </Text>
                    <input
                      onFocus={handleFocus}
                      name="boarderaddress"
                      value={formData.boarderaddress}
                      onChange={handleChange}
                      className="w-[546px] border-b-2 border-customColor1 pb-[-30px] pt-[30px] !text-xl mt-[-10px]"
                    />
                  </div>
                </div>

                {/* Right Side */}
                <div className="mr-[33px] flex w-[48%] flex-col items-start md:mr-0 md:w-full mt-[-2px]">
                  <Text
                    size="md"
                    as="p"
                    className="!font-open-sans tracking-[2.50px]"
                  >
                    Contact Number
                  </Text>
                  <input
                    onFocus={handleFocus}
                    name="boardercontactnumber"
                    value={formData.boardercontactnumber}
                    onChange={handleChange}
                    className="w-[546px] border-b-2 border-customColor1 pb-[-30px] pt-[30px] !text-xl mt-[-10px]"
                  />
                  <Text
                    size="md"
                    as="p"
                    className="mt-[25px] !font-open-sans tracking-[2.50px]"
                  >
                    Course/Profession
                  </Text>
                  <input
                    onFocus={handleFocus}
                    name="boardercourse_profession"
                    value={formData.boardercourse_profession}
                    onChange={handleChange}
                    className="w-[546px] border-b-2 border-customColor1 pb-[-30px] pt-[30px] !text-xl mt-[-10px]"
                  />
                  <Text
                    size="md"
                    as="p"
                    className="mt-[25px] !font-open-sans tracking-[2.50px]"
                  >
                    School/Company
                  </Text>
                  <input
                    onFocus={handleFocus}
                    name="boarderinstitution"
                    value={formData.boarderinstitution}
                    onChange={handleChange}
                    className="w-[546px] border-b-2 border-customColor1 pb-[-30px] pt-[30px] !text-xl mt-[-10px]"
                  />
                  <div className="self-end p-[50px]">
                    <button
                      type="submit"
                      className="bg-transparent border-none cursor-pointer"
                    >
                      <img src="/images/nxtbtn2.png" alt="arrowleft" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <OnScreenKeyboard ref={keyboardRef} />
    </>
  );
}
