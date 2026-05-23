import * as XLSX from 'xlsx';

/**
 * Downloads participant data as an Excel file
 * @param {Array} participants - Array of participant objects with name, surname, team
 * @param {string} projectId - Project ID for the filename
 */
export const downloadParticipantsExcel = (participants, projectId) => {
  if (!participants || participants.length === 0) {
    alert('No participants to download');
    return;
  }

  // Transform data to match Excel columns
  const excelData = participants.map((participant) => ({
    Name: participant.name || '',
    Surname: participant.surname || '',
    Team: participant.team || '',
  }));

  // Create a new workbook and add a worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');

  // Set column widths
  worksheet['!cols'] = [
    { wch: 20 }, // Name
    { wch: 20 }, // Surname
    { wch: 20 }, // Team
  ];

  // Generate filename with project ID and timestamp
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `Participants_${projectId}_${timestamp}.xlsx`;

  // Trigger download
  XLSX.writeFile(workbook, filename);
};
