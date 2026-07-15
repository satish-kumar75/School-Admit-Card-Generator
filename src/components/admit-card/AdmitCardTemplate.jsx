import React from "react";

export const AdmitCardTemplate = React.forwardRef(
  ({ schoolProfile, examDetails, student, subjects }, ref) => {
    const schoolName = schoolProfile.name || "";

    let titleSizeClass = "text-[24px]";
    if (schoolName.length > 35) {
      titleSizeClass = "text-[14px]";
    } else if (schoolName.length > 28) {
      titleSizeClass = "text-[16px]";
    } else if (schoolName.length > 20) {
      titleSizeClass = "text-[19px]";
    }

    return (
      <div
        ref={ref}
        className="bg-white border-[3px] border-black w-[95mm] h-[135mm] box-border p-4 flex flex-col relative"
        style={{
          width: "95mm",
          height: "135mm",
          fontFamily: "'Noto Serif', serif",
          color: "#000",
          lineHeight: 1.2,
        }}
      >
        <div className="flex flex-row items-center justify-between border-b-[3px] border-black pb-2 mb-2">
          <div className="w-[18%] shrink-0 flex items-center justify-center">
            {schoolProfile.logoDataUrl ? (
              <img
                src={schoolProfile.logoDataUrl}
                alt="Logo"
                className="w-[60px] h-[60px] object-contain rounded-full border border-black"
              />
            ) : (
              <div className="w-[60px] h-[60px] rounded-full border border-black flex items-center justify-center text-xs">
                Logo
              </div>
            )}
          </div>
          <div className="w-[82%] text-center px-1">
            <h1
              className={`${titleSizeClass} font-bold leading-tight whitespace-nowrap text-ellipsis`}
              style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
            >
              {schoolName}
            </h1>
            <p
              className="text-[12px] whitespace-pre-wrap leading-snug"
              style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
            >
              {schoolProfile.address}
            </p>
            {(schoolProfile.mobile || schoolProfile.alternateMobile) && (
              <p className="text-[12px] font-bold mt-0.5">
                Mob.: {schoolProfile.mobile}
                {schoolProfile.mobile && schoolProfile.alternateMobile ? ", " : ""}
                {schoolProfile.alternateMobile}
              </p>
            )}
          </div>
        </div>

        <div className="text-center mb-2">
          <h2 className="text-[13px] font-bold uppercase tracking-wide inline-block px-4 pb-0.5 whitespace-nowrap">
            {examDetails.examType === "custom"
              ? examDetails.customLabel
              : `${examDetails.examType} Examination`.replace("-", " ")}{" "}
            – {examDetails.session.split("-")[0]}
          </h2>
          <h3 className="text-[14px] font-bold uppercase tracking-widest leading-tight mt-0.5">
            Admit Card
          </h3>
          <p className="text-[10px] font-bold mt-0.5">
            Time : {examDetails.defaultTimeStart} – {examDetails.defaultTimeEnd}
          </p>
        </div>

        <div className="space-y-1.5 mb-2 text-[11px] font-bold border-t-2 border-black pt-1.5">
          <div className="flex">
            <span className="w-12">Name</span>
            <span className="mx-1">:</span>
            <span className="flex-1 border-b border-black font-medium">
              {student.name}
            </span>
          </div>
          <div className="flex">
            <div className="flex-1 flex">
              <span className="w-12">Class</span>
              <span className="mx-1">:</span>
              <span className="flex-1 border-b border-black text-center font-medium">
                {student.classLabel}
              </span>
            </div>
            <div className="w-3"></div>
            <div className="flex-1 flex">
              <span className="w-14">Roll No.</span>
              <span className="mx-1">:</span>
              <span className="flex-1 border-b border-black text-center font-medium">
                {student.rollNo}
              </span>
            </div>
          </div>
        </div>

        <div className="border border-black mb-auto w-full text-[11px] leading-tight">
          <div className="grid grid-cols-5 bg-black text-white font-bold border-b border-black">
            <div className="col-span-2 py-[2px] px-1 text-center border-r border-white">
              Date & Day
            </div>
            <div className="col-span-3 py-[2px] px-1 text-center">Subject</div>
          </div>
          {subjects.map((sub, idx) => (
            <div
              key={idx}
              className="grid grid-cols-5 border-b border-black last:border-b-0 font-medium"
            >
              <div className="col-span-2 py-[2px] px-1 text-center border-r border-black flex flex-col justify-center">
                {sub.date
                  ? `${new Date(sub.date).getDate()} ${new Date(sub.date).toLocaleString("default", { month: "short" })} (${sub.dayLabel})`
                  : ""}
              </div>
              <div className="col-span-3 py-[2px] px-1 pl-2 flex flex-col justify-center font-bold">
                {sub.name}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-end mt-4 text-[11px] font-bold">
          <div className="w-32 text-center">
            <div className="border-b border-black w-full mb-1"></div>
            Parent Signature
          </div>
          <div className="w-32 text-center">
            <div className="border-b border-black w-full mb-1"></div>
            Head Signature
          </div>
        </div>
      </div>
    );
  },
);

AdmitCardTemplate.displayName = "AdmitCardTemplate";
