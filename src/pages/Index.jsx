import React, { useState, useEffect } from "react";
import { Container, VStack, HStack, Text, Link, Box, Spinner, Heading, IconButton } from "@chakra-ui/react";
import { FaArrowUp } from "react-icons/fa";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
        const storyIds = await response.json();
        const storyPromises = storyIds.slice(0, 10).map(async (id) => {
          const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return storyResponse.json();
        });
        const stories = await Promise.all(storyPromises);
        setStories(stories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stories:", error);
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <Container maxW="container.md" py={8}>
      <Heading as="h1" mb={6}>
        Hacker News
      </Heading>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <VStack spacing={4} align="stretch">
          {stories.map((story) => (
            <Box key={story.id} p={4} borderWidth="1px" borderRadius="md">
              <HStack justify="space-between">
                <Link href={story.url} isExternal fontSize="lg" fontWeight="bold">
                  {story.title}
                </Link>
                <IconButton aria-label="Upvote" icon={<FaArrowUp />} size="sm" />
              </HStack>
              <Text fontSize="sm" color="gray.500">
                {story.score} points by {story.by}
              </Text>
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
};

export default Index;
