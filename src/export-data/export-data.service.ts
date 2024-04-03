import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Workbook, Worksheet } from 'exceljs';
import { createTransport } from 'nodemailer';
import { ResponseUtil } from '../common/utils/response.util';
import { GameHistoryService } from 'src/game-history/game-history.service';

@Injectable()
export class ExportDataService {
  constructor(
    private prisma: PrismaService,
    private readonly responseUtil: ResponseUtil,
  ) {}

  public async exportGameData(userId: string): Promise<string> {
    const histories = await this.prisma.gameHistory.findMany({
      where: {
        userId: userId,
      },
    });

    try {
      const { worksheet, workbook, transporter } = this.setup();
      worksheet.columns = [
        { header: 'Game Type', key: 'gameType' },
        { header: 'Score', key: 'score' },
        { header: 'Start Time', key: 'startTime' },
        { header: 'End Time', key: 'endTime' },
      ];

      histories.forEach((row) => {
        worksheet.addRow({
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

      // temporary mail
      const mailOptions = {
        from: 'elbertmarcellinus@gmail.com',
        to: 'marcellinuselbert46@gmail.com',
        subject: 'Game History Talacare',
        text: 'Please find the empty Excel file attached.',
        attachments: [
          {
            filename: `game_history_${formattedDate}.xlsx`,
            content: buffer,
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      return 'Exported data succesfully sent to email';
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
      auth: {
        user: 'elbertmarcellinus@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    return { workbook, worksheet, transporter };
  }
}
