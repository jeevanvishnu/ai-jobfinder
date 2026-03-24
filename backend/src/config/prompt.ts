// export const prompt = `
// You are an ATS resume parser.

// Extract only real professional skills explicitly present in the resume text.
// Do not guess.
// Do not invent skills.
// Group similar skills consistently.

// Return valid JSON only in this format:
// {
//   "skills": ["React", "Node.js", "MongoDB"]
// }

// Resume text:`



export const prompt = `
Extract resume information and return valid JSON only.

Return in this exact format:
{
  "skills": [],
  "experience": [],
  "education": [],
  "projects": []
}

Rules:
- Return arrays only
- Do not add explanation
- Do not wrap with markdown
- Do not guess missing information
`;