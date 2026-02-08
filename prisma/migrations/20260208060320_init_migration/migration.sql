-- CreateTable
CREATE TABLE "mst_user" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mst_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trn_register" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "npk" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "attendance" TEXT NOT NULL,
    "groupId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCheckedIn" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "trn_register_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trn_comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trn_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trn_group" (
    "id" SERIAL NOT NULL,
    "groupNumber" INTEGER NOT NULL,
    "groupName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trn_group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mst_user_username_key" ON "mst_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "trn_register_npk_key" ON "trn_register"("npk");

-- AddForeignKey
ALTER TABLE "trn_register" ADD CONSTRAINT "trn_register_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "trn_group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
