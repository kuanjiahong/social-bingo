import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const ITEMS = [
  "Wear glasses",
  "Is left-handed",
  "Has a tattoo",
  "Has dyed hair",
  "Speaks more than 3 languages",
  "Is the eldest child",
  "Is the youngest child",
  "Can whistle loudly",
  "Has completed a Triathlon",
  "Speaks Bahasa Melayu fluently",
  "Can name all Malaysian states",
  "Comes from East Malaysia",
  "Is a MAHK Member",
  "Is not from KL or Penang",
  "Took STPM",
  "Has eaten durian during this year",
  "Has climbed Mt. Kinabalu",
  "Has lived in HK for more than 2 years",
  "Can speak a bit of Cantonese",
  "Can cook at least 2 Malaysian dishes",
  "Has visited more than 10 countries",
  "Has tried Muay Thai or any martial arts",
  "Has worked in another country",
  "Is from Macao",
  "Has met Chow Yun Fat in HK before",
];

const CENTER_INDEX = Math.floor(ITEMS.length / 2);

const BINGO_LINES = [
  // rows
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  // columns
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  // diagonals
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

interface BingoCellProps {
  idx: number;
  item: string;
  value: string;
  onChange: (idx: number, input: string) => void;
  highlighted: boolean;
  isCenter: boolean;
}
function BingoCell(props: Readonly<BingoCellProps>) {
  const { idx, item, value, onChange, highlighted, isCenter } = props;
  return (
    <Box
      sx={{
        aspectRatio: "1 / 1",
        border: "2px solid",
        borderColor: highlighted
          ? "success.main"
          : isCenter
            ? "primary.main"
            : "grey.400",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 1,
        backgroundColor: isCenter
          ? "primary.light"
          : value
            ? "success.light"
            : "background.paper",
        transition: "all 0.2s",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          textAlign: "center",
          userSelect: "none",
        }}
      >
        {item}
      </Typography>

      <TextField
        value={value}
        onChange={(e) => {
          onChange(idx, e.target.value);
        }}
        placeholder="Name"
        variant="standard"
        slotProps={{
          input: {
            disableUnderline: true,
            sx: {
              textAlign: "center",
              fontSize: 14,
              backgroundColor: "rgba(255,255,255,0.7)",
              borderRadius: 1,
              px: 1,
            },
          },
        }}
      />
    </Box>
  );
}

function BingoCard() {
  // name written in each cell
  const [names, setNames] = useState<string[]>(() => {
    const saved = localStorage.getItem("bingo-names");
    return saved ? JSON.parse(saved) : Array(25).fill("");
  });
  useEffect(() => {
    localStorage.setItem("bingo-names", JSON.stringify(names));
  }, [names]);

  const hasBingo = BINGO_LINES.some((line) =>
    line.every((idx) => names[idx].trim() !== ""),
  );

  const winningLine =
    BINGO_LINES.find((line) => line.every((idx) => names[idx].trim() !== "")) ??
    [];

  const updateName = (idx: number, value: string) => {
    setNames((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 1 }}>
      <Stack spacing={2} sx={{ mb: 1 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 2 }}>
          SOCIAL BINGO
        </Typography>
        <Box>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (confirm("This will reset your card. Are you sure?")) {
                setNames(Array(25).fill(""));
                localStorage.removeItem("bingo-names");
              }
            }}
          >
            New Card
          </Button>
        </Box>
      </Stack>
      <Typography
        variant="caption"
        align="center"
        sx={{ color: "text.secondary", mt: 1 }}
      >
        ← Swipe to see more →
      </Typography>
      <Box
        sx={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          minWidth: 600, // adjust based on cell size
          minHeight: "100vh",
          mx: "auto",
        }}
      >
        {hasBingo && (
          <Typography
            variant="h5"
            sx={{ textAlign: "center", fontWeight: 700, my: 2 }}
          >
            🎉 BINGO! You've completed a line! 🎉
          </Typography>
        )}
        <Grid container columns={5} spacing={2} gap={2} sx={{ mt: 2 }}>
          {ITEMS.map((item, idx) => (
            <Grid key={`${item}-${idx.toString()}`} size={1}>
              <BingoCell
                idx={idx}
                item={item}
                value={names[idx]}
                highlighted={winningLine.includes(idx)}
                onChange={updateName}
                isCenter={idx === CENTER_INDEX}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

function App() {
  return (
    <>
      <CssBaseline />
      <BingoCard />
    </>
  );
}

export default App;
