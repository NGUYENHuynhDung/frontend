import React from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

export default function SelectTypeBar(props) {
  const { options, selectType, setSelectType } = props;
  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={selectType}
        onChange={(e) => {
          setSelectType(e.target.value);
        }}
      >
        {options?.map((item) => (
          <FormControlLabel
            key={item?.id}
            value={item?.value}
            control={<Radio />}
            label={item?.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
