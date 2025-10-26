-- CreateTable
CREATE TABLE "public"."simple_note" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "simple_note_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."simple_note" ADD CONSTRAINT "simple_note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
