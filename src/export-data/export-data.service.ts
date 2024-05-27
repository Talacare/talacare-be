import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Workbook, Worksheet } from 'exceljs';
import { createTransport } from 'nodemailer';

@Injectable()
export class ExportDataService {
  constructor(private prisma: PrismaService) {}

  public async exportGameData(emailTo: string, role: string): Promise<string> {
    if (role != 'ADMIN') {
      throw new ForbiddenException(
        'Only user with role admin can export the game data',
      );
    }

    const histories = await this.prisma.gameHistory.findMany({
      orderBy: {
        gameType: 'asc',
      },
    });

    try {
      const { worksheet, workbook, transporter } = this.setup();

      histories.forEach((row) => {
        worksheet.addRow({
          userId: row.userId,
          gameType: row.gameType,
          score: row.score,
          startTime: new Date(row.startTime),
          endTime: new Date(row.endTime),
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const currentDate = new Date();
      const formattedDate = currentDate
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-');

      const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: emailTo,
        subject: 'Game History Talacare',
        text: 'Please find the exported game data attached',
        attachments: [
          {
            filename: `game_history_${formattedDate}.xlsx`,
            content: buffer,
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      return 'Exported data successfully sent to email';
    } catch (error) {
      return 'Export data failed';
    }
  }

  public setup(): {
    workbook: Workbook;
    worksheet: Worksheet;
    transporter: any;
  } {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const transporter = createTransport({
      service: 'Gmail',
      secure: true,
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    worksheet.columns = [
      { header: 'User', key: 'userId' },
      { header: 'Game Type', key: 'gameType' },
      { header: 'Score', key: 'score' },
      { header: 'Start Time', key: 'startTime' },
      { header: 'End Time', key: 'endTime' },
    ];

    return { workbook, worksheet, transporter };
  }
}
