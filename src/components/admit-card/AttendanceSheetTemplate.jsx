import React from "react";

export const AttendanceSheetTemplate = React.forwardRef(
  ({ schoolProfile, classLabel, dateParts, rows }, ref) => {
    const schoolName = schoolProfile.name || "";

    let titleSizeClass = "text-[34px]";
    if (schoolName.length > 50) {
      titleSizeClass = "text-[20px]";
    } else if (schoolName.length > 40) {
      titleSizeClass = "text-[24px]";
    } else if (schoolName.length > 30) {
      titleSizeClass = "text-[28px]";
    }

    return (
      <div
        ref={ref}
        className="bg-white border-2 border-black w-[190mm] h-[277mm] box-border px-5 py-3 flex flex-col relative"
        style={{
          width: "190mm",
          height: "277mm",
          fontFamily: "'Noto Serif', serif",
          color: "#000",
          lineHeight: 1.25,
        }}
      >
        <div className="flex flex-row items-start pb-2">
          <div className="shrink-0 w-[110px] flex items-start justify-center">
            {schoolProfile.logoDataUrl ? (
              <img
                src={schoolProfile.logoDataUrl}
                alt="Logo"
                className="w-[110px] h-[120px] object-contain"
              />
            ) : (
              <div className="w-[88px] h-[88px] rounded-full border border-black flex items-center justify-center text-sm">
                Logo
              </div>
            )}
          </div>
          <div className="flex-1 text-center px-2 pt-1">
            <h1
              className={`${titleSizeClass} font-bold leading-tight`}
              style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
            >
              {schoolName}
            </h1>
            <p
              className="text-[14px] leading-snug"
              style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
            >
              {schoolProfile.address}
            </p>
            {(schoolProfile.mobile || schoolProfile.alternateMobile) && (
              <p className="text-[14px] font-bold">
                Mob.: {schoolProfile.mobile}
                {schoolProfile.mobile && schoolProfile.alternateMobile
                  ? ", "
                  : ""}
                {schoolProfile.alternateMobile}
              </p>
            )}
          </div>
        </div>
        <div className="border-b border-black ml-[122px] -mt-7" aria-hidden="true" />

        <div className="flex justify-center py-2">
          <h2
            className="text-[26px] font-extrabold uppercase whitespace-nowrap leading-tight bg-[#e5e5e5] rounded-lg border border-black px-8 py-0.5"
            style={{ fontFamily: "'Baloo 2', 'Noto Serif', serif" }}
          >
            Attendance Sheet
          </h2>
        </div>

        <div className="flex items-end justify-between text-[20px] font-bold pb-2">
          <div className="flex items-end min-w-0">
            <span className="whitespace-nowrap">Class:</span>
            <span className="ml-2 px-3 border-b border-black min-w-32 text-center">
              {classLabel || " "}
            </span>
          </div>
          <div className="flex items-end">
            <span className="whitespace-nowrap">Date:</span>
            <span className="ml-2 px-1 border-b border-black text-center min-w-12">
              {dateParts.day || " "}
            </span>
            <span className="mx-1">/</span>
            <span className="px-1 border-b border-black text-center min-w-12">
              {dateParts.month || " "}
            </span>
            <span className="mx-1">/</span>
            <span className="px-1 border-b border-black text-center min-w-20">
              {dateParts.year || " "}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col border border-black overflow-hidden min-h-0">
          <div className="grid grid-cols-12 bg-black text-white font-bold text-[16px] border-b border-black shrink-0">
            <div className="col-span-1 py-1.5 px-1 text-center border-r border-white">
              S. No.
            </div>
            <div className="col-span-3 py-1.5 px-1 text-center border-r border-white">
              Student Name
            </div>
            <div className="col-span-3 py-1.5 px-1 text-center border-r border-white">
              Father&apos;s Name
            </div>
            <div className="col-span-3 py-1.5 px-1 text-center border-r border-white">
              Mother&apos;s Name
            </div>
            <div className="col-span-2 py-1.5 px-1 text-center">Signature</div>
          </div>
          {rows.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 flex-1 min-h-0 border-b border-black last:border-b-0 text-[14px]"
            >
              <div className="col-span-1 px-1 text-center border-r border-black flex items-center justify-center font-medium">
                {row.sno}
              </div>
              <div className="col-span-3 px-2 border-r border-black flex items-center font-medium truncate">
                {row.name || " "}
              </div>
              <div className="col-span-3 px-2 border-r border-black flex items-center truncate">
                {row.fatherName || " "}
              </div>
              <div className="col-span-3 px-2 border-r border-black flex items-center truncate">
                {row.motherName || " "}
              </div>
              <div className="col-span-2 px-1 flex items-center"> </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

AttendanceSheetTemplate.displayName = "AttendanceSheetTemplate";
