const fs = require("fs/promises");

(async () => {
  const createFileCommand = "create a file";
  const deleteFileCommand = "delete the file";
  const renameFileCommand = "rename the file";
  const addFileCommand = "add to the file";
  const createFile = async (path) => {
    try {
      const newFile = await fs.open(path, "wx");

      console.log(`File with path ${path} succesfully created`);
      newFile.close();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFile = async (path) => {
    try {
      await fs.unlink(path);
      console.log("Successfully deleted");
    } catch (error) {
      console.log(error);
    }
  };

  const renameFile = async (oldName, newName) => {
    try {
      await fs.rename(oldName, newName);
      console.log("File rename successful");
    } catch (error) {
      console.log(error);
    }
  };

  const appendToFile = async (path, content) => {
    try {
      await fs.appendFile(path, content, "utf8");
    } catch (error) {
      console.log(error);
    }
  };

  try {
    const commandHandler = await fs.open("./command.txt", "r");
    commandHandler.on("change", async () => {
      const size = (await commandHandler.stat()).size;

      buff = Buffer.alloc(size);
      await commandHandler.read(buff, 0, buff.byteLength, 0);
      const buffCommand = buff.toString();
      if (buffCommand.includes(createFileCommand)) {
        const filePath = buffCommand.split(" ")[3];
        createFile(filePath);
      } else if (buffCommand.includes(deleteFileCommand)) {
        const filePath = buffCommand.substring(deleteFileCommand.length + 1);
        deleteFile(filePath);
      } else if (buffCommand.includes(renameFileCommand)) {
        const _idx = buffCommand.indexOf(" to ");
        const oldfileName = buffCommand.substring(
          renameFileCommand.length + 1,
          _idx
        );
        const newfileName = buffCommand.substring(53);
        renameFile(oldfileName, newfileName);
      } else if (buffCommand.includes(addFileCommand)) {
        const _idx = buffCommand.indexOf("-");
        const filePath = buffCommand.substring(addFileCommand.length + 1, _idx);
        const content = buffCommand.substring(_idx + 1);
        appendToFile(filePath, content);
      }
    });

    const watcher = fs.watch("./command.txt");

    for await (const event of watcher) {
      if (event.eventType === "change") {
        commandHandler.emit("change");
      }
    }
  } catch (error) {
    if (error) {
      console.log(error);
    }
  } finally {
    await commandHandler.close();
  }
})();

// const readfunc = async () => {
//   try {
//     const watcher = fs.watch("./command.txt");
//     const content = await fs.readFile("./command.txt", "utf-8");
//     for await (const event of watcher) {
//       if (event.eventType === "change") {
//         console.log(content);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
// readfunc();
