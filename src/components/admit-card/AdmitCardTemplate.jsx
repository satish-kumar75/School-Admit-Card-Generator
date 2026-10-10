import React from "react";

export const AdmitCardTemplate = React.forwardRef(
  ({ schoolProfile, examDetails, student, subjects }, ref) => {
    const schoolName = schoolProfile.name || "";

    let titleSizeClass = "text-[30px]";
    if (schoolName.length > 50) {
      titleSizeClass = "text-[19px]";
    } else if (schoolName.length > 40) {
      titleSizeClass = "text-[22px]";
    } else if (schoolName.length > 30) {
      titleSizeClass = "text-[26px]";
    }

    const sigDate = schoolProfile.signatureDate
      ? new Date(schoolProfile.signatureDate)
      : null;
    const sigDateLabel =
      sigDate && !isNaN(sigDate.getTime())
        ? `${String(sigDate.getDate()).padStart(2, "0")}/${String(sigDate.getMonth() + 1).padStart(2, "0")}/${sigDate.getFullYear()}`
        : "";

    return (
      <div
        ref={ref}
        className="bg-white border-[3px] border-black w-[190mm] h-[130mm] box-border px-5 py-2.5 flex flex-col relative"
        style={{
          width: "190mm",
          height: "130mm",
          fontFamily: "'Noto Serif', serif",
          color: "#000",
          lineHeight: 1.25,
        }}
      >
        {/* Header: logo left, school identity centered */}
        <div className="flex flex-row items-center border-b-[2px] border-black pb-1.5">
          <div className="shrink-0 flex items-center justify-center">
            {schoolProfile.logoDataUrl ? (
              <img
                src={schoolProfile.logoDataUrl}
                alt="Logo"
                className="w-[58px] h-[58px] object-contain rounded-full border border-black"
              />
            ) : (
              <div className="w-[58px] h-[58px] rounded-full border border-black flex items-center justify-center text-sm">
                Logo
              </div>
            )}
          </div>
          <div className="flex-1 text-center px-2">
            <h1
              className={`${titleSizeClass} font-bold leading-tight`}
              style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
            >
              {schoolName}
            </h1>
            <p
              className="text-[13px] leading-snug"
              style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
            >
              {schoolProfile.address}
            </p>
            {(schoolProfile.mobile || schoolProfile.alternateMobile) && (
              <p className="text-[13px] font-bold">
                Mob.: {schoolProfile.mobile}
                {schoolProfile.mobile && schoolProfile.alternateMobile
                  ? ", "
                  : ""}
                {schoolProfile.alternateMobile}
              </p>
            )}
          </div>
          {/* spacer keeps the title optically centered like the reference */}
          <div className="w-[58px] shrink-0" aria-hidden="true" />
        </div>

        {/* Exam title block */}
        <div className="text-center border-b border-black py-1">
          <h2 className="text-[14px] font-bold uppercase tracking-wide leading-tight">
            {examDetails.examType === "custom"
              ? examDetails.customLabel
              : `${examDetails.examType} Examination`.replace("-", " ")}{" "}
            – {examDetails.session.split("-")[0]}
          </h2>
          <h3 className="text-[16px] font-bold uppercase tracking-wide leading-tight">
            Admit Card
          </h3>
          <p className="text-[12px] font-medium">
            Time : {examDetails.defaultTimeStart} – {examDetails.defaultTimeEnd}
          </p>
        </div>

        {/* Student fields — full-width ruled lines like the reference */}
        <div className="pt-1.5 pb-1.5 space-y-1 text-[13px] font-bold">
          <div className="flex items-end">
            <span className="whitespace-nowrap w-28">Name</span>
            <span className="mx-2">:</span>
            <span className="flex-1 border-b border-black font-medium px-1 truncate">
              {student.name || " "}
            </span>
          </div>
          <div className="flex items-end">
            <span className="whitespace-nowrap w-28">Father&apos;s Name</span>
            <span className="mx-2">:</span>
            <span className="flex-1 border-b border-black font-medium px-1 truncate">
              {student.fatherName || " "}
            </span>
          </div>
          <div className="flex items-end">
            <span className="whitespace-nowrap w-28">Mother&apos;s Name</span>
            <span className="mx-2">:</span>
            <span className="flex-1 border-b border-black font-medium px-1 truncate">
              {student.motherName || " "}
            </span>
          </div>
          <div className="flex items-end">
            <div className="flex items-end w-[42%] min-w-0">
              <span className="whitespace-nowrap w-28">Class</span>
              <span className="mx-2">:</span>
              <span className="flex-1 border-b border-black text-center font-medium px-1 truncate">
                {student.classLabel || " "}
              </span>
            </div>
            <div className="flex items-end flex-1 min-w-0 ml-6">
              <span className="whitespace-nowrap">Roll No.</span>
              <span className="mx-2">:</span>
              <span className="flex-1 border-b border-black font-medium px-1">
                {student.rollNo || " "}
              </span>
            </div>
          </div>
        </div>

        {/* Date sheet table — full width */}
        <div className="border border-black text-[13px] leading-tight overflow-hidden">
          <div className="grid grid-cols-2 bg-black text-white font-bold border-b border-black">
            <div className="py-[3px] px-1 text-center border-r border-white">
              Date & Day
            </div>
            <div className="py-[3px] px-1 text-center">Subject</div>
          </div>
          {subjects.map((sub, idx) => (
            <div
              key={idx}
              className="grid grid-cols-2 border-b border-black last:border-b-0"
            >
              <div className="py-[2px] px-1 text-center border-r border-black font-medium">
                {sub.date
                  ? `${new Date(sub.date).getDate()} ${new Date(
                      sub.date,
                    ).toLocaleString("default", {
                      month: "short",
                    })} (${sub.dayLabel})`
                  : ""}
              </div>
              <div className="py-[2px] px-3 font-bold truncate">{sub.name}</div>
            </div>
          ))}
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end mt-auto pt-2.5 text-[13px] font-bold">
          <div className="w-56 text-center">
            <div className="border-b border-black w-full mb-1"></div>
            Parent Signature
          </div>
          <div className="w-56 text-center">
            {(schoolProfile.signatureDataUrl || sigDateLabel) && (
              <div className="flex flex-col items-center justify-end">
                {schoolProfile.signatureDataUrl ? (
                  <img
                    src={schoolProfile.signatureDataUrl}
                    alt="Signature"
                    className="max-h-8 max-w-28 object-contain"
                  />
                ) : null}
                {sigDateLabel ? (
                  <div
                    className="text-[17px] font-normal leading-none"
                    style={{ fontFamily: "'Caveat', cursive" }}
                  >
                    {sigDateLabel}
                  </div>
                ) : null}
              </div>
            )}
            <div className="border-b border-black w-full mb-1"></div>
            Head of Gurukul
          </div>
        </div>
      </div>
    );
  },
);

AdmitCardTemplate.displayName = "AdmitCardTemplate";
