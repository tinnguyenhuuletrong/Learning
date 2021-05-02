/*
Copyright © 2021 NAME HERE <EMAIL ADDRESS>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
package cmd

import (
	"fmt"
	"strconv"

	"github.com/spf13/cobra"
)

// addCmd represents the add command
var addCmd = &cobra.Command{
	Use:   "add [a] [b]",
	Short: "Add 2 numbers",
	Long:  ``,
	Args:  cobra.ExactArgs(2),
	Run: func(cmd *cobra.Command, args []string) {
		a, err := strconv.ParseFloat(args[0], 32)
		if err != nil {
			fmt.Println("First param is not number", err)
			return
		}

		b, err := strconv.ParseFloat(args[1], 32)
		if err != nil {
			fmt.Println("Second param is not number", err)
			return
		}

		fmt.Println(a + b)
	},
}

func init() {
	rootCmd.AddCommand(addCmd)
}
