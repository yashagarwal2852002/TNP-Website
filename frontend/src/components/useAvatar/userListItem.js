import React from 'react';
import { Box, Text, Avatar } from "@chakra-ui/react";

export default function UserListItem({ user, handleFunction }) {
    return (
        <div>
            <Box
                onClick={handleFunction}
                cursor="pointer"
                bg="#E8E8E8"
                _hover={{
                    background: "#38B2AC",
                    color: "white",
                }}
                w="100%"
                display="flex"
                alignItems="center"
                color="black"
                px={3}
                py={2}
                mb={2}
                borderRadius="lg"
            >
                <Avatar
                    mr={2}
                    size="sm"
                    cursor="pointer"
                    name={`${user.firstName} ${user.middleName} ${user.lastName}`}
                    src={user.pic}
                />

                <Box>
                    <Text>{`${user.firstName} ${user.middleName} ${user.lastName}`}</Text>
                    <Text fontSize="xs">
                        <b>Scholar No. : </b>
                        {user.scholarNo}
                    </Text>
                </Box>
            </Box>
        </div>
    )
}
