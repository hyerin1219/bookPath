'use client';
import { Dispatch, SetStateAction } from 'react';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
        color: '#ff3d47',
    },
});

interface IHeartRatingProps {
    heartValue: number;
    setHeartValue?: Dispatch<SetStateAction<number>>;
    readOnly?: boolean; // 읽기 전용 모드
}

export default function HeartRating({ heartValue, setHeartValue, readOnly = false }: IHeartRatingProps) {
    return (
        <div>
            <StyledRating
                name="customized-color"
                value={heartValue}
                precision={1}
                getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
                icon={<FavoriteIcon fontSize="inherit" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                onChange={(_, newValue) => {
                    if (!readOnly && newValue !== null && setHeartValue) setHeartValue(newValue);
                }}
                readOnly={readOnly}
            />
        </div>
    );
}
