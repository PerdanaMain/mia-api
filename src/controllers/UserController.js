// prisma initialization
const { PrismaClient } = require("@prisma/client");
const excelJs = require("exceljs");

const getUsers = async (req, res) => {
  try {
    const prisma = new PrismaClient();

    const users = await prisma.amanat_users.findMany({
      select: {
        username: true,
        user_fullname: true,
        user_pass: true,
        user_jabatan: true,
        unit_id: true,
      },
    });

    const units = await prisma.amanat_unit.findMany({
      select: {
        unit_id: true,
        unit_desc: true,
        unit_kode: true,
      },
    });

    // loop users for relationship
    users.forEach((element) => {
      units.forEach((item) => {
        if (element.unit_id == item.unit_id) {
          // make new object
          const obj = {
            unit_desc: item.unit_desc,
            unit_kode: item.unit_kode,
          };

          element.units = obj;
        }
      });
    });

    return res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const massInsert = async (req, res) => {
  try {
    const prisma = new PrismaClient();

    // get request body type module
    const { id_region } = req.body;

    const unit = await prisma.amanat_unit.findMany({
      where: {
        id_region,
      },
    });

    const data = [];

    const user = ["op_", "astuu_", "askep_", "mnj_"];

    // change value unit
    unit.forEach((element) => {
      // convert element.unit_desc to lowercase
      const unit_desc = element.unit_desc;
      element.unit_desc = element.unit_desc.toLowerCase();
      element.unit_desc = element.unit_desc.replace(/ /g, "_");
      element.unit_desc = element.unit_desc.replace(/\./g, "");

      if (element.unit_desc !== "keuangan_&_akuntansi") {
        // loop user
        user.forEach((item) => {
          if (item == "op_") {
            data.push({
              username: item + element.unit_desc + `_${id_region - 1}`,
              user_fullname: "Operator " + unit_desc.toLocaleLowerCase(),
              user_nip: 12345,
              user_email:
                item + element.unit_desc + `_${id_region - 1}` + "@mia.com",
              user_jabatan: "Operator",
              hak_akses_id: 7,
              unit_id: element.unit_id,
              sub_unit_id: 1,
              afdeling_id: 0,
              user_pass:
                "$2y$10$UP541MuF6GGUg7cp8Y/IjeTar8ci6g5rhdDaNYPBiimPpYXo3pOP2",
              created_at: new Date(),
              updated_at: new Date(),
            });
          } else if (item == "astuu_") {
            data.push({
              username: item + element.unit_desc + `_${id_region - 1}`,
              user_fullname: "Asisten TUU " + unit_desc.toLocaleLowerCase(),
              user_nip: 12345,
              user_email:
                item + element.unit_desc + `_${id_region - 1}` + "@mia.com",
              user_jabatan: "Asisten TUU",
              hak_akses_id: 5,
              unit_id: element.unit_id,
              sub_unit_id: 1,
              afdeling_id: 0,
              user_pass:
                "$2y$10$UP541MuF6GGUg7cp8Y/IjeTar8ci6g5rhdDaNYPBiimPpYXo3pOP2",
              created_at: new Date(),
              updated_at: new Date(),
            });
          } else if (item == "askep_") {
            data.push({
              username: item + element.unit_desc + `_${id_region - 1}`,
              user_fullname: "Asisten Kepala " + unit_desc.toLocaleLowerCase(),
              user_nip: 12345,
              user_email:
                item + element.unit_desc + `_${id_region - 1}` + "@mia.com",
              user_jabatan: "Asisten Kepala",
              hak_akses_id: 4,
              unit_id: element.unit_id,
              sub_unit_id: 0,
              afdeling_id: 0,
              user_pass:
                "$2y$10$UP541MuF6GGUg7cp8Y/IjeTar8ci6g5rhdDaNYPBiimPpYXo3pOP2",
              created_at: new Date(),
              updated_at: new Date(),
            });
          } else if (item == "mnj_") {
            data.push({
              username: item + element.unit_desc + `_${id_region - 1}`,
              user_fullname: "Manajer " + unit_desc.toLocaleLowerCase(),
              user_nip: 12345,
              user_email:
                item + element.unit_desc + `_${id_region - 1}` + "@mia.com",
              user_jabatan: "Manajer",
              hak_akses_id: 3,
              unit_id: element.unit_id,
              sub_unit_id: 0,
              afdeling_id: 0,
              user_pass:
                "$2y$10$UP541MuF6GGUg7cp8Y/IjeTar8ci6g5rhdDaNYPBiimPpYXo3pOP2",
              created_at: new Date(),
              updated_at: new Date(),
            });
          }
        });
      }
    });

    data.push(
      {
        username: `kasi_${id_region - 1}`,
        user_fullname: `Bagian Keuangan & Akuntansi Regional ${id_region - 1}`,
        user_nip: 12345,
        user_email: `kasi_${id_region - 1}` + "@mia.com",
        user_jabatan: "Kasi",
        hak_akses_id: 2,
        unit_id: 301 + id_region,
        sub_unit_id: 0,
        user_pass:
          "$2y$10$UP541MuF6GGUg7cp8Y/IjeTar8ci6g5rhdDaNYPBiimPpYXo3pOP2",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: `op_reg${id_region - 1}`,
        user_fullname: `Operator Regional ${id_region - 1}`,
        user_nip: 12345,
        user_email: `op_reg${id_region - 1}` + "@mia.com",
        user_jabatan: `Operator Regional ${id_region - 1}`,
        hak_akses_id: 6,
        unit_id: 301 + id_region,
        sub_unit_id: 1,
        user_pass:
          "$2y$10$UP541MuF6GGUg7cp8Y/IjeTar8ci6g5rhdDaNYPBiimPpYXo3pOP2",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: `kasub_reg${id_region - 1}`,
        user_fullname: `Kepala Sub Bagian Regional ${id_region - 1}`,
        user_nip: 12345,
        user_email: `kasub_reg${id_region - 1}` + "@mia.com",
        user_jabatan: `Kepala Sub Bagian Regional ${id_region - 1}`,
        hak_akses_id: 6,
        unit_id: 301 + id_region,
        sub_unit_id: 1,
        user_pass:
          "$2y$10$UP541MuF6GGUg7cp8Y/IjeTar8ci6g5rhdDaNYPBiimPpYXo3pOP2",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: `kabag_reg${id_region - 1}`,
        user_fullname: `Kepala Bagian Regional ${id_region - 1}`,
        user_nip: 12345,
        user_email: `kabag_reg${id_region - 1}` + "@mia.com",
        user_jabatan: `Kepala Bagian Regional ${id_region - 1}`,
        hak_akses_id: 6,
        unit_id: 301 + id_region,
        sub_unit_id: 1,
        user_pass:
          "$2y$10$UP541MuF6GGUg7cp8Y/IjeTar8ci6g5rhdDaNYPBiimPpYXo3pOP2",
        created_at: new Date(),
        updated_at: new Date(),
      }
    );

    // loop users for relationship
    const units = await prisma.amanat_unit.findMany({
      where: {
        id_region,
      },
    });
    data.forEach((element) => {
      units.forEach((item) => {
        if (element.unit_id == item.unit_id) {
          element.unit_desc = item.unit_desc;
        }
      });
    });

    try {
      // insert data
      // await prisma.amanat_users.createMany({
      //   data,
      // });

      const exp = await manualExport(data, id_region);

      return res.status(200).json({
        status: exp ?? true,
        message: "Users created successfully",
        count: data.length,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        error: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const manualExport = async (data, id) => {
  try {
    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Users");
    const path = "./public/exports";

    //coloumn header
    worksheet.columns = [
      { header: "Username", key: "username", width: 40 },
      { header: "Fullname", key: "user_fullname", width: 35 },
      { header: "Password", key: "user_pass", width: 20 },
      { header: "Jabatan", key: "user_jabatan", width: 20 },
      { header: "Nama Unit", key: "unit_desc", width: 30 },
    ];

    const users = data;
    const id_region = id;

    users.forEach((element, index) => {
      users[index].user_pass = 12345;

      // add users to excel
      worksheet.addRow(users[index]);
    });

    //making first line in excel bold
    worksheet.getRow(1).font = { bold: true };

    await workbook.xlsx.writeFile(
      `${path}/users_regional${id_region - 1}.xlsx`
    );
    return `${path}/users_regional${id_region - 1}.xlsx`;
  } catch (error) {
    return error.message;
  }
};

const exportUsers = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    // select some coloumn in amanat_users
    const users = await prisma.amanat_users.findMany({
      select: {
        username: true,
        user_fullname: true,
        user_pass: true,
        user_jabatan: true,
        unit_id: true,
      },
    });

    const units = await prisma.amanat_unit.findMany({
      select: {
        unit_id: true,
        unit_desc: true,
        unit_kode: true,
      },
    });

    // loop users for relationship
    users.forEach((element) => {
      units.forEach((item) => {
        if (element.unit_id == item.unit_id) {
          element.unit_desc = item.unit_desc;
        }
      });
    });

    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Users");
    const path = "./public/exports";

    //coloumn header
    worksheet.columns = [
      { header: "Username", key: "username", width: 40 },
      { header: "Fullname", key: "user_fullname", width: 35 },
      { header: "Password", key: "user_pass", width: 20 },
      { header: "Jabatan", key: "user_jabatan", width: 20 },
      { header: "Nama Unit", key: "unit_desc", width: 30 },
    ];

    users.forEach((element, index) => {
      users[index].user_pass = 12345;

      // add users to excel
      worksheet.addRow(users[index]);
    });

    //making first line in excel bold
    worksheet.getRow(1).font = { bold: true };

    try {
      // save excel to public folder
      await workbook.xlsx.writeFile(`${path}/users.xlsx`);

      return res.status(200).json({
        status: true,
        message: "Export users success",
        path: `${path}/users.xlsx`,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        url: req.protocol + "://" + req.get("host"),
        error: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};
module.exports = {
  getUsers,
  massInsert,
  exportUsers,
};
