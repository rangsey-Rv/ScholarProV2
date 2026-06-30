import { redirect } from "next/navigation";

export default function StudentIndexPage() {
  // Redirect to the application page so `/students` shows the same view
  redirect("/students/application");
}
