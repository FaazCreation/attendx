'use server';

/**
 * @fileOverview Generates an analysis of attendance trends to identify members with consistently low attendance.
 *
 * - analyzeAttendanceTrends - Analyzes attendance records to identify members with low attendance.
 * - AnalyzeAttendanceTrendsInput - The input type for the analyzeAttendanceTrends function.
 * - AnalyzeAttendanceTrendsOutput - The return type for the analyzeAttendanceTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAttendanceTrendsInputSchema = z.object({
  attendanceRecords: z.string().describe('JSON string of attendance records, each record should contain member ID and attendance status for each session.'),
  attendanceThreshold: z.number().describe('Minimum attendance percentage required to be considered active.'),
});
export type AnalyzeAttendanceTrendsInput = z.infer<
  typeof AnalyzeAttendanceTrendsInputSchema
>;

const AnalyzeAttendanceTrendsOutputSchema = z.object({
  lowAttendanceMembers: z.string().describe('JSON array of member IDs who fall below the attendance threshold.'),
  summary: z.string().describe('A summary of the attendance trends and identified low attendance members.'),
});
export type AnalyzeAttendanceTrendsOutput = z.infer<
  typeof AnalyzeAttendanceTrendsOutputSchema
>;

export async function analyzeAttendanceTrends(
  input: AnalyzeAttendanceTrendsInput
): Promise<AnalyzeAttendanceTrendsOutput> {
  return analyzeAttendanceTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'attendanceTrendAnalysisPrompt',
  input: {schema: AnalyzeAttendanceTrendsInputSchema},
  output: {schema: AnalyzeAttendanceTrendsOutputSchema},
  prompt: `You are an expert in data analysis, specializing in attendance records.

You are provided with attendance records in JSON format and an attendance threshold.

Your goal is to identify members who consistently fall below the specified attendance threshold and provide a summary of the attendance trends.

Attendance Records: {{{attendanceRecords}}}
Attendance Threshold: {{{attendanceThreshold}}}%

Analyze the attendance records and identify members whose attendance percentage is less than the provided threshold. Return the member IDs in a JSON array.
Also, provide a concise summary of your analysis, highlighting the key trends and the identified low attendance members.

Ensure that the output is properly formatted JSON.
`,
});

const analyzeAttendanceTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeAttendanceTrendsFlow',
    inputSchema: AnalyzeAttendanceTrendsInputSchema,
    outputSchema: AnalyzeAttendanceTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
