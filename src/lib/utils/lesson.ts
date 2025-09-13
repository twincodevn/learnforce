import { LessonContent } from "@/types";

export function parseLessonContent(content: string): LessonContent {
  try {
    return JSON.parse(content) as LessonContent;
  } catch (error) {
    console.error("Error parsing lesson content:", error);
    // Return a default lesson content structure
    return {
      type: "multiple_choice",
      question: "Error loading lesson content",
      options: ["Error"],
      correctAnswer: "Error",
    };
  }
}

export function serializeLessonContent(content: LessonContent): string {
  try {
    return JSON.stringify(content);
  } catch (error) {
    console.error("Error serializing lesson content:", error);
    return JSON.stringify({
      type: "multiple_choice",
      question: "Error",
      options: ["Error"],
      correctAnswer: "Error",
    });
  }
}
