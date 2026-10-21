import type { PublicTeacher } from "@/utils/public-directory-data";

export function TeacherPageFooter({ teacher, className = "" }: { teacher: PublicTeacher; className?: string }) {
  return (
    <footer className={`mt-auto border-t border-border bg-background ${className}`}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>
          © {new Date().getFullYear()} {teacher.name}
        </span>
        <span>অনলাইন কোর্স ও পরীক্ষা</span>
      </div>
    </footer>
  );
}
