import jsPDF from 'jspdf';

export const exportAttendancePDF = (sessionTitle, attendanceList) => {
  const doc = new jsPDF();
  doc.text(`Attendance Report - ${sessionTitle}`, 10, 10);
  attendanceList.forEach((a, index) => {
    doc.text(`${index + 1}. ${a.userId}`, 10, 20 + index * 10);
  });
  doc.save(`${sessionTitle}_attendance.pdf`);
};
