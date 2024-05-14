import { TutorialHeaderProps } from "@site/src/components/TutorialHeader";

export interface ScriptHeadersType {
  [key: string]: TutorialHeaderProps;
}

export const ScriptHeaders: ScriptHeadersType = {
  basic: {
    time: "5 - 7 min",
    topics: [
      { label: "Script", link: "/docs/tech-explanation/glossary#script" },
      {
        label: "CKB-VM",
        link: "/docs/tech-explanation/glossary#ckb-vm",
      },
      { label: "Cell Model", link: "/docs/tech-explanation/cell-model" },
      {
        label: "Transaction",
        link: "/docs/tech-explanation/glossary#transaction",
      },
    ],
    tools: [
      <div>
        <a
          href="https://git-scm.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          git
        </a>
        ,
        <a
          href="https://www.tutorialspoint.com/unix_commands/make.htm"
          target="_blank"
          rel="noopener noreferrer"
        >
          make
        </a>
        ,
        <a
          href="https://www.gnu.org/software/sed/"
          target="_blank"
          rel="noopener noreferrer"
        >
          sed
        </a>
        ,
        <a
          href="https://www.gnu.org/software/bash/"
          target="_blank"
          rel="noopener noreferrer"
        >
          bash
        </a>
        ,
        <a
          href="https://linux.die.net/man/1/sha256sum"
          target="_blank"
          rel="noopener noreferrer"
        >
          sha256sum
        </a>
        {" and others Unix utilities."}
      </div>,
      <div>
        <a href={"https://www.rust-lang.org/"}>Rust</a>
        {" and riscv64 target: "}{" "}
        <code>rustup target add riscv64imac-unknown-none-elf</code>
      </div>,
      <div>
        <a
          href={
            "https://releases.llvm.org/16.0.0/tools/clang/docs/ReleaseNotes.html"
          }
        >
          Clang 16+
        </a>

        <ul>
          <li>
            Debian / Ubuntu:{" "}
            <code>
              wget https://apt.llvm.org/llvm.sh && chmod +x llvm.sh && sudo
              ./llvm.sh 16 && rm llvm.sh
            </code>
          </li>
          <li>
            Fedora 39+: <code>sudo dnf -y install clang</code>
          </li>
          <li>
            Archlinux: <code>sudo pacman --noconfirm -Syu clang</code>
          </li>
          <li>
            MacOS (with <a href="https://brew.sh/">Homebrew</a>):{" "}
            <code>brew install llvm@16</code>
          </li>
          <li>
            Windows (with <a href="https://scoop.sh/">Scoop</a>):{" "}
            <code>scoop install llvm yasm</code>
          </li>
        </ul>
      </div>,
      <div>
        <a href="https://github.com/cargo-generate/cargo-generate">
          cargo-generate
        </a>
      </div>,
    ],
  },
};

export default ScriptHeaders;
