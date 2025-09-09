-- CreateTable
CREATE TABLE "public"."_ProjectOwner" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectOwner_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectOwner_B_index" ON "public"."_ProjectOwner"("B");

-- AddForeignKey
ALTER TABLE "public"."_ProjectOwner" ADD CONSTRAINT "_ProjectOwner_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ProjectOwner" ADD CONSTRAINT "_ProjectOwner_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
